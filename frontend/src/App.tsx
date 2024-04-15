import { Route, Routes, BrowserRouter } from "react-router-dom"


import { Landing } from "./pages/Landing"
import { Signin } from "./pages/Signin"
import { Signup } from "./pages/SignUp"

function App() {
 
  
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dalle" element={ <Landing /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
