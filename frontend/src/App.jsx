import React from 'react'
import { Routes, Route } from 'react-router-dom'
import DiskScheduling from './components/DiskScheduling/Disk_Scheduling'

const App = () => {
  return (
    <Routes>
      <Route path="/*" element={<DiskScheduling />} />
    </Routes>
  )
}

export default App