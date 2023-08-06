import React from 'react'

const layout = ({ children }) => {
  return (
    <div className='mx-auto w-full max-w-screen-2xl min-h-screen'>{children}</div>
  )
}

export default layout