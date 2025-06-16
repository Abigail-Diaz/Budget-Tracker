import { useState } from 'react'

import './App.css'
import PageBackground from './PageBackground.jsx'

function App() {
  // React states
const [header, setHeader] = useState('Dashboard');

  return (
  
      <PageBackground header={header}>
      </PageBackground>
      
  )
}

export default App
