
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./views/Home"
import SignIn from "./views/SignIn"
import DashChart from "./views/modules/DashChart"

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/chart" element={<DashChart />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/" element={<SignIn />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
