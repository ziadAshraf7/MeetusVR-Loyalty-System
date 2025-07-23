import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Dashboard from './pages/Dashboard';

createRoot(document.getElementById("root")!).render(<App />);
