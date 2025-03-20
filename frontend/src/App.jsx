import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Rishi from './components/Rishi/Rishi'

const App = () => {
  return (
    <Routes>
      <Route path="/*" element={<Rishi />} />
    </Routes>
  )
}

export default App