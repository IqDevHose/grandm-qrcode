import { Route, Routes } from "react-router-dom"
import Restaurant from "./pages/restaurant"

const App = () => {
  return (
    <Routes>
      <Route path=":id" element={<Restaurant />} />
    </Routes>
  )
}

export default App