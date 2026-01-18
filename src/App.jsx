import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProjectCMS from './pages/ProjectCMS';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<ProjectCMS />} />
    </Routes>
  );
}
