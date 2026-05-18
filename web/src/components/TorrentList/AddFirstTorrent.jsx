import { useTheme } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Player } from '@lordicon/react'
import folderIcon from 'assets/lordicon/system-regular-44-folder-hover-pinch.json'

import AddDialog from '../Add/AddDialog'
import IconWrapper from './style'

export default function AddFirstTorrent() {
  const { t } = useTranslation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const handleClickOpen = () => setIsDialogOpen(true)
  const handleClose = () => setIsDialogOpen(false)
  const primary = useTheme().palette.primary.main
  const playerRef = useRef(null)
  const timerRef = useRef(null)

  const loop = useCallback(() => {
    timerRef.current = setTimeout(() => playerRef.current?.playFromBeginning(), 2000)
  }, [])

  useEffect(() => {
    timerRef.current = setTimeout(() => playerRef.current?.playFromBeginning(), 2000)
    return () => clearTimeout(timerRef.current)
  }, [loop])

  return (
    <>
      <IconWrapper onClick={() => handleClickOpen(true)} $isButton>
        <Player
          ref={playerRef}
          icon={folderIcon}
          state='hover-pinch'
          colors={`primary:#575757,secondary:${primary}`}
          size={200}
          onComplete={loop}
        />
        <div className='icon-label'>{t('NoTorrentsAdded')}</div>
      </IconWrapper>

      {isDialogOpen && <AddDialog handleClose={handleClose} />}
    </>
  )
}
