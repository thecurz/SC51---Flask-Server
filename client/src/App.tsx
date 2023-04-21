import { Route, Routes } from 'react-router-dom';
import { Index, Menu, Admin } from './components';
import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  )
}

export default App
