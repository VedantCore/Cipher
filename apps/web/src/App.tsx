import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Default route pushes users to register */}
        <Route path="/" element={<Navigate to="/register" />} />
      </Routes>
    </BrowserRouter>
  );
}

// THIS IS THE CRITICAL LINE THAT FIXES YOUR ERROR:
export default App;