import React from 'react'
export const a11yProps = index => ({
  id: `full-width-tab-${index}`,
  'aria-controls': `full-width-tabpanel-${index}`,
})

export const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role='tabpanel'
    id={`full-width-tabpanel-${index}`}
    aria-labelledby={`full-width-tab-${index}`}
    aria-hidden={value !== index}
    style={{ width: '100%', flexShrink: 0, height: '100%', overflowY: 'auto' }}
    {...other}
  >
    {children}
  </div>
)
