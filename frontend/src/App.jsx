import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Espacios from './components/Espacios';
import Reservas from './pages/Reservas';
import Confirmacion from './pages/ConfirmacionReserva';
import Exito from './pages/Exito';

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/espacios" element={<Espacios />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/confirmacion" element={<Confirmacion />} />
        <Route path="/exito" element={<Exito />} />
      </Routes>
    </Router>
  );
}

export default App
