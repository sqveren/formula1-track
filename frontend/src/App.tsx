import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<main className="min-h-screen bg-slate-950" />} />
    </Routes>
  );
}

export default App;
