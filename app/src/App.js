import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MainPage } from "./views/MainPage";
import { GalleryPage } from "./views/GalleryPage";
import { useEffect } from "react";
import { initDB } from "./services/indexedDBService";

// Agregar al theme
// typography: {
//   fontFamily: '"Atkinson Hyperlegible", sans-serif;',
//   fontWeightRegular: 700

function App() {
  // Initialize the IndexedDB when the app starts
  useEffect(() => {
    const initializeDB = async () => {
      try {
        await initDB();
        console.log("IndexedDB initialized successfully");
      } catch (error) {
        console.error("Error initializing IndexedDB:", error);
      }
    };

    initializeDB();
  }, []);

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<MainPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
