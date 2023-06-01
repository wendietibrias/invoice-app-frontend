import { Route,Routes } from "react-router-dom";
import {
    Login,
    Register,
    Homepage,
    Invoice
} from "./pages";
const App = () => {
  return (
    <div className="App"> 
      <Routes>
        <Route index element={<Homepage/>}></Route>
        <Route path="/auth/login" element={<Login/>}/>
        <Route path="/auth/register" element={<Register/>}/>
        <Route path="/invoice/:id" element={<Invoice/>}/>
      </Routes>
    </div>
  );
}

export default App;
