import React from 'react'
import { Grid, OutlinedInput, Slider } from '@mui/material'

export default function SliderInput({
  isProMode,
  title,
  value,
  setValue,
  sliderMin,
  sliderMax,
  inputMin,
  inputMax,
  step = 1,
  onBlurCallback,
}) {
  const onBlur = ({ target: { value } }) => {
    if (value < inputMin) return setValue(inputMin)
    if (value > inputMax) return setValue(inputMax)

    onBlurCallback && onBlurCallback(value)
  }

  const onInputChange = ({ target: { value } }) => setValue(value === '' ? '' : Number(value))
  const onSliderChange = (_, newValue) => setValue(newValue)

  return (
    <>
      <div>{title}</div>
      <Grid
        container
        spacing={2}
        sx={{
          alignItems: 'center',
        }}
      >
        <Grid size='grow'>
          <Slider
            min={sliderMin}
            max={sliderMax}
            value={value}
            onChange={onSliderChange}
            step={step}
            size='small'
            color='secondary'
          />
        </Grid>

        {isProMode && (
          <Grid>
            <OutlinedInput
              value={value}
              size='small'
              onChange={onInputChange}
              onBlur={onBlur}
              style={{ width: '91px', marginTop: '-6px' }}
              slotProps={{ htmlInput: { step, min: inputMin, max: inputMax, type: 'number' } }}
            />
          </Grid>
        )}
      </Grid>
    </>
  )
}
