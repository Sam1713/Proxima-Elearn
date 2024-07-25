import React from 'react'
import Landing from './landing/Landing'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Register from './components/studentAuth/Register'
function App() {
  return <BrowserRouter>
  <Routes>
    <Route path="/"element={<Landing />}/>
    <Route path='/login'element={<Register />}/>
  </Routes>
  </BrowserRouter>
}

export default App
