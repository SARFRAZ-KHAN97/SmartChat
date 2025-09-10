import Login from "./Components/Login";
import { Route, Routes } from "react-router-dom";
import PageNotFound from "./Components/PageNotFound";
import Chat from "./Components/Chat";
import Home from "./Components/Home"
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {


  return (
    <>
   <Routes>
      <Route path="/" element={<ProtectedRoute ><Home></Home>
      </ProtectedRoute>   }></Route>
      <Route path="/login" element={<Login></Login>}></Route>
      <Route path="/:chatid" element={<ProtectedRoute>
        <Home></Home></ProtectedRoute>}></Route>
      <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
   </Routes>
   </>
  )
}

export default App
//<ProtectedRoute isLoggedIn={isLoggedIn}>  </ProtectedRoute>