import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Typography,
  Snackbar,
  Alert,
  Box,
  IconButton,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Save as SaveIcon,
  ArrowForward as ArrowForwardIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import ThemeToggleSwitch from "../components/ThemeToggleSwitch";
import InstallAlertDialog from "../components/InstallAlertDialog.jsx";
import SaveImageDialog from "../components/SaveImageDialog.jsx";
import { saveImage } from "../services/indexedDBService.js";
import { useSxStyles } from "../styles/globalSxStyles";
import {
  MediaBox,
  urlToBlob,
  downloadImage,
  FiltersMenu,
} from "./FiltersMenu.js";

function MainPage() {
  const style = useSxStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [imageURL, setImageURL] = useState(null);
  const [initialImageUrl, setInitialImageUrl] = useState(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [installDialogOpen, setInstallDialogOpen] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const handleCloseSnackbar = () => {
    setSnackbarState({ ...snackbarState, open: false });
  };

  useEffect(() => {
    if (location.state?.imageURL) {
      setImageURL(location.state.imageURL);
      setInitialImageUrl(location.state.imageURL);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  return (
    <Box sx={style.mainContainer}>
      <InstallAlertDialog
        open={installDialogOpen}
        onClose={() => setInstallDialogOpen(false)}
      />

      <Box sx={style.mainHeaderContainer}>
        <ThemeToggleSwitch /> {/* Switch de tema a la izquierda */}
        {/* Botones Info + Gallery a la derecha */}
        <Box sx={style.galleryButtonContainer}>
          {!window.matchMedia("(display-mode: standalone)").matches && (
            <IconButton
              aria-label="info-install"
              onClick={() => setInstallDialogOpen(true)}
              sx={style.infoButton}
            >
              <InfoIcon sx={style.iconSize} />
            </IconButton>
          )}
          <Button
            variant="contained"
            onClick={() => navigate("/gallery")}
            sx={style.galleryButton}
          >
            Gallery <ArrowForwardIcon sx={{ ml: 1 }} />
          </Button>
        </Box>
      </Box>

      <Box sx={style.mediaContainer}>
        <MediaBox
          imageURL={imageURL}
          setImageURL={setImageURL}
          setInitialImageUrl={setInitialImageUrl}
        />
        <FiltersMenu
          imageURL={imageURL}
          setImageURL={setImageURL}
          initialImageUrl={initialImageUrl}
        />
      </Box>

      <Box sx={style.largeButtonsContainer}>
        <Button
          id="downloadButton"
          variant="contained"
          sx={style.largeButton}
          disabled={!imageURL}
          startIcon={<DownloadIcon />}
          onClick={downloadImage(imageURL, "processed_image.png")}
        >
          Download
        </Button>
        <Button
          id="saveButton"
          variant="contained"
          sx={style.largeButton}
          disabled={!imageURL}
          startIcon={<SaveIcon />}
          onClick={() => setSaveDialogOpen(true)}
        >
          Save to Gallery
        </Button>
      </Box>

      <SaveImageDialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        onSave={async (name) => {
          try {
            const blob = await urlToBlob(imageURL);
            await saveImage(blob, name);
            setSaveDialogOpen(false);
            setSnackbarState({
              open: true,
              message: "Image saved successfully!",
              severity: "success",
            });
          } catch (err) {
            setSnackbarState({
              open: true,
              message: "Error saving image",
              severity: "error",
            });
          }
        }}
        previewUrl={imageURL}
      />

      <Snackbar
        open={snackbarState.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarState.severity}
          sx={style.fwidth}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>

      <Typography variant="body2" sx={style.welcomeText}>
        Welcome to ▸ <strong>Get Some Filters</strong> ◂ <br />
        Feel free to use any available filter. Upload, experiment, download —
        it's that simple.
      </Typography>
    </Box>
  );
}

export { MainPage };
