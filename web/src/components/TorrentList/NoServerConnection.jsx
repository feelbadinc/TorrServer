import React, { useCallback, useEffect, useRef } from 'react'
import { useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Player } from '@lordicon/react'
import serverIcon from 'assets/lordicon/wired-outline-57-server-hover-pinch.json'

import IconWrapper from './style'

export default function NoServerConnection() {
  const { t } = useTranslation()
  const primary = useTheme().palette.primary.main
  const playerRef = useRef(null)

  const loop = useCallback(() => playerRef.current?.playFromBeginning(), [])

  useEffect(() => {
    const timer = setTimeout(loop, 300)
    return () => clearTimeout(timer)
  }, [loop])

  return (
    <IconWrapper>
      <Player
        ref={playerRef}
        icon={serverIcon}
        state='hover-pinch'
        colors={`primary:#121331,secondary:${primary}`}
        size={200}
        onComplete={loop}
      />
      <div className='icon-label'>{t('Offline')}</div>
    </IconWrapper>
  )
}
