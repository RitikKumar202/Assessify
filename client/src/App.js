import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import "./App.css";


function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
