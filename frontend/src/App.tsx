import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { UsersPage } from "@/pages/users-page"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/usuarios" replace />} />
        <Route path="/usuarios" element={<UsersPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
