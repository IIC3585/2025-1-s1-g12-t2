import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom'
import { MainPage } from './views/MainPage'
import { red } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: red[500],
    },
  },
  typography: {
    fontFamily: '"Atkinson Hyperlegible", sans-serif;',
    fontWeightRegular: 700
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
    <Router>
      <Routes>
        <Route exact path="/" element={<MainPage/>}></Route>
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
