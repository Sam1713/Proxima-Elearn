import React from 'react'
import Landing from './landing/Landing'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Register from './components/studentAuth/Register'
import Header from './headers/Header'
function App() {
  return <BrowserRouter>
  <Header/>
  <Routes>
    <Route path="/"element={<Landing />}/>
    <Route path='/login'element={<Register />}/>
  </Routes>
  </BrowserRouter>
}

export default App
