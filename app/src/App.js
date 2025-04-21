import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MainPage } from "./views/MainPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<MainPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
