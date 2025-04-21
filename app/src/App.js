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
import { useEffect } from 'react';
import { initDB } from './services/indexedDBService';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5863cc',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Atkinson Hyperlegible", sans-serif;',
    fontWeightRegular: 700
  },
});

function App() {
  // Initialize the IndexedDB when the app starts
  useEffect(() => {
    const initializeDB = async () => {
      try {
        await initDB();
        console.log('IndexedDB initialized successfully');
      } catch (error) {
        console.error('Error initializing IndexedDB:', error);
      }
    };
    
    initializeDB();
  }, []);

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