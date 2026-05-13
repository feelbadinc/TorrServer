import {
  Box,
  CircularProgress,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Slider,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Forward10Icon from '@mui/icons-material/Forward10'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import GetAppIcon from '@mui/icons-material/GetApp'
import PauseIcon from '@mui/icons-material/Pause'
import PictureInPictureIcon from '@mui/icons-material/PictureInPicture'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import Replay10Icon from '@mui/icons-material/Replay10'
import SpeedIcon from '@mui/icons-material/Speed'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { StyledDialog } from 'style/CustomMaterialUiStyles'
import { useTranslation } from 'react-i18next'

import { StyledButton } from './TorrentCard/style'

function getMimeType(url) {
  const ext = url.split('?')[0].split('.').pop().toLowerCase()
  switch (ext) {
    case 'mp4':
      return 'video/mp4'
    case 'ogg':
    case 'ogv':
      return 'video/ogg'
    case 'webm':
      return 'video/webm'
    default:
      return ''
  }
}

const pulse = keyframes`
  0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
  50% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1.3); opacity: 0; }
`

const PrettoSlider = styled(Slider)`
  color: #00a572;
  height: 6px;
  & .MuiSlider-thumb {
    height: 18px;
    width: 18px;
    background-color: #fff;
    border: 2px solid currentColor;
    margin-top: -6px;
    margin-left: -12px;
  }
  & .MuiSlider-track {
    height: 6px;
    border-radius: 4px;
  }
  & .MuiSlider-rail {
    height: 6px;
    border-radius: 4px;
  }
  @media (max-width: 600px) {
    height: 0;
    & .MuiSlider-thumb {
      height: 15px;
      width: 15px;
      margin-top: -5px;
      margin-left: -7px;
    }
    & .MuiSlider-track {
      height: 5px;
    }
  }
`

const VideoWrapper = styled(Box)`
  position: relative;
  width: 100%;
  background-color: #000;
  overflow: hidden;
  &:hover .controls,
  &:hover .centralControl,
  &:hover .skipButton {
    opacity: 1;
  }
  .centralControl {
    animation: ${pulse} 0.6s ease-out;
  }
`

const StyledVideo = styled.video`
  width: 100%;
  display: block;
  cursor: pointer;
  @media (max-width: 600px) {
    height: 94.5vh;
    width: 100vw;
    object-fit: contain;
  }
`

const sliderSx = {
  color: '#00e68a',
  '& .MuiSlider-thumb': { backgroundColor: '#00e68a' },
  '& .MuiSlider-track': { borderRadius: '2px' },
}

const iconButtonSx = {
  color: '#fff',
  padding: '12px',
  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
  '@media (max-width: 600px)': { padding: '10px' },
}

// Helper function to format seconds to HH:MM:SS
const formatTime = seconds => {
  if (!isFinite(seconds)) return '00:00:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const hh = h.toString().padStart(2, '0')
  const mm = m.toString().padStart(2, '0')
  const ss = s.toString().padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

const VideoPlayer = ({ videoSrc, captionSrc = '', title, onNotSupported }) => {
  const isMobile = useMediaQuery('@media (max-width:930px)')
  const videoRef = useRef(null)
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [fullscreen, setFullscreen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [speed, setSpeed] = useState(1)

  useEffect(() => {
    const vid = document.createElement('video')
    if (!vid.canPlayType(getMimeType(videoSrc))) onNotSupported()
  }, [videoSrc, onNotSupported])

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.paused ? video.play() : video.pause()
  }, [])

  const togglePlay = () => setPlaying(p => !p)
  const handleTimeUpdate = () => setCurrentTime(videoRef.current.currentTime)
  const handleLoaded = () => {
    setDuration(videoRef.current.duration)
    setLoading(false)
  }
  const handleSeek = (_, val) => {
    videoRef.current.currentTime = val
    handleTimeUpdate()
  }
  const handleVolume = (_, val) => {
    const v = val / 100
    videoRef.current.volume = v
    setVolume(v)
    setMuted(v === 0)
  }
  const toggleMute = () => {
    videoRef.current.muted = !muted
    setMuted(m => !m)
  }

  const skip = useCallback(
    secs => {
      const video = videoRef.current
      if (!video) return
      const target = Math.min(Math.max(video.currentTime + secs, 0), duration)
      video.currentTime = target
      setCurrentTime(target)
    },
    [duration],
  )

  const enterFull = () => videoRef.current.requestFullscreen()
  const exitFull = () => document.exitFullscreen()

  useEffect(() => {
    const onFull = () => setFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFull)
    return () => document.removeEventListener('fullscreenchange', onFull)
  }, [])

  const openSpeedMenu = e => setAnchorEl(e.currentTarget)
  const closeSpeedMenu = () => setAnchorEl(null)
  const changeSpeed = val => {
    videoRef.current.playbackRate = val
    setSpeed(val)
    closeSpeedMenu()
  }
  const downloadVideo = () => {
    const a = document.createElement('a')
    a.href = videoSrc
    a.download = ''
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleKey = useCallback(
    e => {
      if (!open) return
      switch (e.key) {
        case ' ':
          e.preventDefault()
          handlePlayPause()
          break
        case 'ArrowRight':
          e.preventDefault()
          skip(10)
          break
        case 'ArrowLeft':
          e.preventDefault()
          skip(-10)
          break
        default:
          break
      }
    },
    [open, handlePlayPause, skip],
  )
  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [handleKey])

  return (
    <>
      <StyledButton onClick={() => setOpen(true)}>
        <PlayArrowIcon />
        <span>{t('Play')}</span>
      </StyledButton>
      <StyledDialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth='lg'
        fullWidth
        fullScreen={isMobile}
        PaperProps={{ sx: { backgroundColor: '#fff', borderRadius: 1 } }}
      >
        <DialogTitle
          disableTypography
          sx={{
            backgroundColor: '#00a572',
            color: '#fff',
            padding: '8px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant='h6' noWrap>
            {title || 'Video Player'}
          </Typography>
          <IconButton size='medium' onClick={() => setOpen(false)} sx={iconButtonSx}>
            <CloseIcon fontSize='medium' />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ padding: 0 }}>
          <VideoWrapper onClick={handlePlayPause} style={isMobile ? { minHeight: 240 } : {}}>
            <StyledVideo
              autoPlay
              ref={videoRef}
              src={videoSrc}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoaded}
              onPlay={togglePlay}
              onPause={togglePlay}
            >
              <track kind='captions' srcLang='en' label='English captions' src={captionSrc} default />
            </StyledVideo>
            {loading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  zIndex: 4,
                }}
              >
                <CircularProgress fontSize='medium' />
              </Box>
            )}
            <IconButton
              size='medium'
              className='centralControl'
              style={{ opacity: playing ? 0 : 1 }}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                padding: '8px',
                backgroundColor: 'rgba(0,0,0,0.5)',
                opacity: 0,
                transition: 'opacity 200ms',
                zIndex: 3,
                color: '#fff',
                pointerEvents: 'none',
              }}
            >
              <PlayArrowIcon fontSize='medium' />
            </IconButton>
            <Box
              className='controls'
              onClick={e => e.stopPropagation()}
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                padding: '0 24px 16px 24px',
                transition: 'opacity 200ms',
                opacity: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                zIndex: 3,
                pointerEvents: 'auto',
                '@media (max-width: 600px)': {
                  opacity: 1,
                  padding: '0 8px 16px 8px',
                  gap: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)',
                },
              }}
            >
              {isMobile && (
                <Box
                  sx={{
                    color: '#fff',
                    paddingLeft: '16px',
                    '@media (max-width: 600px)': { paddingLeft: '8px', fontSize: 9 },
                  }}
                >
                  <Typography variant='body2'>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </Typography>
                </Box>
              )}
              <PrettoSlider sx={sliderSx} value={currentTime} max={duration} onChange={handleSeek} size='medium' />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title={playing ? t('Pause') : t('Play')}>
                  <IconButton size='medium' onClick={handlePlayPause} sx={iconButtonSx}>
                    {playing ? <PauseIcon fontSize='medium' /> : <PlayArrowIcon fontSize='medium' />}
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('Rewind-10-Sec')}>
                  <IconButton
                    size='medium'
                    sx={iconButtonSx}
                    onClick={e => {
                      e.stopPropagation()
                      skip(-10)
                    }}
                  >
                    <Replay10Icon fontSize='medium' />
                  </IconButton>
                </Tooltip>

                <Tooltip title={t('Forward-10-Sec')}>
                  <IconButton
                    size='medium'
                    sx={iconButtonSx}
                    onClick={e => {
                      e.stopPropagation()
                      skip(10)
                    }}
                  >
                    <Forward10Icon fontSize='medium' />
                  </IconButton>
                </Tooltip>
                <Tooltip title={muted ? t('Unmute') : t('Mute')}>
                  <IconButton size='medium' sx={iconButtonSx} onClick={toggleMute}>
                    {muted ? <VolumeOffIcon fontSize='medium' /> : <VolumeUpIcon fontSize='medium' />}
                  </IconButton>
                </Tooltip>
                {!isMobile && (
                  <Slider
                    sx={sliderSx}
                    value={volume * 100}
                    onChange={handleVolume}
                    size='medium'
                    style={{ width: 70 }}
                  />
                )}
                {!isMobile && (
                  <Box
                    sx={{
                      color: '#fff',
                      paddingLeft: '16px',
                      '@media (max-width: 600px)': { paddingLeft: '8px', fontSize: 9 },
                    }}
                  >
                    <Typography variant='body2'>
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </Typography>
                  </Box>
                )}
                <Box flexGrow={1} />
                <Tooltip title={t('Speed')}>
                  <IconButton size='medium' onClick={openSpeedMenu} sx={iconButtonSx}>
                    <SpeedIcon fontSize='medium' />
                  </IconButton>
                </Tooltip>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeSpeedMenu} sx={{ minWidth: 100 }}>
                  {[0.5, 1, 1.5, 2].map(r => (
                    <MenuItem key={r} selected={r === speed} onClick={() => changeSpeed(r)}>
                      {r}x
                    </MenuItem>
                  ))}
                </Menu>
                <Tooltip title={t('PIP')}>
                  <IconButton
                    size='medium'
                    sx={iconButtonSx}
                    onClick={() => videoRef.current.requestPictureInPicture()}
                  >
                    <PictureInPictureIcon fontSize='medium' />
                  </IconButton>
                </Tooltip>

                <Tooltip title={t('Download')}>
                  <IconButton size='medium' sx={iconButtonSx} onClick={downloadVideo}>
                    <GetAppIcon fontSize='medium' />
                  </IconButton>
                </Tooltip>

                <Tooltip title={fullscreen ? t('ExitFullscreen') : t('Fullscreen')}>
                  <IconButton size='medium' onClick={fullscreen ? exitFull : enterFull} sx={iconButtonSx}>
                    {fullscreen ? <FullscreenExitIcon fontSize='medium' /> : <FullscreenIcon fontSize='medium' />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </VideoWrapper>
        </DialogContent>
      </StyledDialog>
    </>
  )
}

export default VideoPlayer
