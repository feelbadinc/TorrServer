import { useMediaQuery } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { useMemo, useState } from 'react'

import { mainColors, themeColors } from './colors'

export const THEME_MODES = { LIGHT: 'light', DARK: 'dark', AUTO: 'auto' }

const typography = { fontFamily: 'Open Sans, sans-serif' }

const breakpoints = { values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 } }

const cssBaselineOverride = {
  MuiCssBaseline: {
    styleOverrides: {
      body: { fontSize: '14px' },
    },
  },
}

export const darkTheme = createTheme({
  typography,
  breakpoints,
  palette: {
    mode: THEME_MODES.DARK,
    primary: { main: mainColors.dark.primary },
    secondary: { main: mainColors.dark.secondary },
  },
  components: cssBaselineOverride,
})
export const lightTheme = createTheme({
  typography,
  breakpoints,
  palette: {
    mode: THEME_MODES.LIGHT,
    primary: { main: mainColors.light.primary },
    secondary: { main: mainColors.light.secondary },
  },
  components: cssBaselineOverride,
})

export const useMaterialUITheme = () => {
  const savedThemeMode = localStorage.getItem('themeMode')
  const isSystemModeDark = useMediaQuery('(prefers-color-scheme: dark)')
  const [currentThemeMode, setCurrentThemeMode] = useState(savedThemeMode || THEME_MODES.AUTO)

  const updateThemeMode = mode => {
    setCurrentThemeMode(mode)
    localStorage.setItem('themeMode', mode)
  }

  const isDarkMode =
    currentThemeMode === THEME_MODES.DARK || (currentThemeMode === THEME_MODES.AUTO && isSystemModeDark)

  const theme = isDarkMode ? THEME_MODES.DARK : THEME_MODES.LIGHT

  const muiTheme = useMemo(
    () =>
      createTheme({
        typography,
        breakpoints,
        palette: {
          mode: theme,
          primary: { main: mainColors[theme].primary },
          secondary: { main: mainColors[theme].secondary },
        },
        components: {
          ...cssBaselineOverride,
          MuiTypography: {
            styleOverrides: {
              h6: {
                fontSize: '1.0rem',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: themeColors[theme].app.paperColor,
                backgroundImage: 'none',
              },
            },
          },
          MuiInputBase: {
            styleOverrides: {
              input: {
                color: mainColors[theme].labels,
              },
            },
          },
          // https://material-ui.com/ru/api/form-control-label/
          MuiFormControlLabel: {
            styleOverrides: {
              labelPlacementStart: {
                display: 'flex',
                justifyContent: 'space-between',
                marginStart: 0,
                marginTop: 6,
                marginBottom: 2,
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                color: mainColors[theme].labels,
                marginBottom: 8,
                '&.Mui-focused': {
                  color: mainColors[theme].labels,
                },
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                padding: 12,
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                '&.Mui-selected': {
                  backgroundColor: theme === THEME_MODES.DARK ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                  '&:hover': {
                    backgroundColor: theme === THEME_MODES.DARK ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                  },
                },
              },
            },
          },
          MuiListItemIcon: {
            styleOverrides: {
              root: {
                minWidth: 56,
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                paddingTop: 8,
                paddingBottom: 8,
              },
            },
          },
          MuiFormGroup: {
            styleOverrides: {
              root: {
                '& .MuiFormHelperText-root': {
                  marginTop: -8,
                },
              },
            },
          },
        },
      }),
    [theme],
  )

  return [isDarkMode, currentThemeMode, updateThemeMode, muiTheme]
}
