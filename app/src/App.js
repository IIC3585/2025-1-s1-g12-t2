import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom'
import { MainPage } from './views/MainPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<MainPage/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
