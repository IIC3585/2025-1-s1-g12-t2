import { useEffect, useState } from "react";
import init, { resize, grayscale, blur } from "../pkg/img.js";
import ImageIcon from "@mui/icons-material/Image";
import {
  styled,
  Button,
  Typography,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import SaveIcon from "@mui/icons-material/Save";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Box from "@mui/material/Box";
import ThemeToggleSwitch from "../components/ThemeToggleSwitch";
import { useTheme } from "@mui/material/styles";
import InstallAlertDialog from "../components/InstallAlertDialog.jsx";
import SaveImageDialog from "../components/SaveImageDialog.jsx";
import { saveImage } from "../services/indexedDBService.js";
import { useNavigate, useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const actionColor = "#5863cc";

function imageToUrl(imageData) {
  const blob = new Blob([imageData], { type: "image/png" });
  return URL.createObjectURL(blob);
}

async function urlToBlob(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return blob;
}

function downloadImage(imageURL, fileName) {
  return async () => {
    const link = document.createElement("a");
    link.href = imageURL;
    link.download = fileName;
    link.click();
  };
}

function applyToImage(setImageURL, fn, args, initialImageUrl) {
  return async () => {
    await init();
    const fileInput = document.getElementById("imageInput");
    let arrayBuffer;

    if (fileInput.files[0]) {
      arrayBuffer = await fileInput.files[0].arrayBuffer();
    } else if (initialImageUrl) {
      const response = await fetch(initialImageUrl);
      const blob = await response.blob();
      arrayBuffer = await blob.arrayBuffer();
    }

    if (arrayBuffer) {
      const imageData = fn(new Uint8Array(arrayBuffer), ...args);
      const imageURL = imageToUrl(imageData);
      setImageURL(imageURL);
    }
  };
}

function MediaBox({ imageURL, setImageURL, setInitialImageUrl }) {
  const hoverColor = actionColor;
  const mediaBoxSx = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: { xs: "100%", sm: "100%", md: "100%", lg: "200%" },
    height: 500,
    border: "2px dashed",
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "#f5f5f5",
    color: "#cccccc",
    "&:hover": {
      borderColor: hoverColor,
      cursor: "pointer",
    },
    "&:hover .child": {
      color: hoverColor,
    },
  };
  const imageBoxSx = {
    objectFit: "contain",
    maxHeight: "90%",
    maxWidth: "90%",
  };
  let image = (
    <Box component="img" sx={imageBoxSx} alt="Image preview" src={imageURL} />
  );
  let initialMessage = (
    <>
      <ImageIcon
        className="child"
        fontSize="inherit"
        style={{ fontSize: "10rem" }}
      />
      <Typography className="child" variant="h6" component="h2" gutterBottom>
        Click to upload an image
      </Typography>
    </>
  );
  return (
    <Box
      sx={mediaBoxSx}
      onClick={() => document.getElementById("imageInput").click()}
    >
      {imageURL ? image : initialMessage}
      <VisuallyHiddenInput
        id="imageInput"
        type="file"
        onChange={(event) => {
          const file = event.target.files[0];
          if (!file) return;
          const url = URL.createObjectURL(file);
          setImageURL(url);
          setInitialImageUrl(url);
        }}
        multiple
      />
    </Box>
  );
}

function FiltersMenu({ imageURL, setImageURL, initialImageUrl }) {
  const theme = useTheme();
  const buttonSx = {
    width: "100%",
    backgroundColor: theme.palette.primary.main,
    fontWeight: "bold",
    borderRadius: 4,
  };
  const filtersBoxSx = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    borderRadius: 4,
    gap: 1.5,
    margin: 2,
  };
  const menuBoxSx = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "top",
    width: { xs: "100%", sm: "100%", md: "100%", lg: "100%" },
    maxWidth: 400,
    border: "2px solid",
    borderColor: "#ccc",
    borderRadius: 4,
    padding: { xs: 2, sm: 3, md: 3 },
    boxSizing: "border-box",
    margin: "0 auto",
  };
  const imgFilterFunctions = [
    { name: "resize", fn: resize, args: [200, 200] },
    { name: "grayscale", fn: grayscale, args: [] },
    { name: "blur", fn: blur, args: [5.0] },
  ];
  return (
    <Box sx={menuBoxSx}>
      <Typography variant="h5" component="h2" sx={{ margin: 1 }}>
        ⊷ Available Filter ⊶
      </Typography>
      <Box sx={filtersBoxSx}>
        {imgFilterFunctions.map((filter, index) => (
          <Button
            key={index}
            id={`${filter.name}Button`}
            variant="contained"
            sx={buttonSx}
            disabled={!imageURL}
            onClick={applyToImage(
              setImageURL,
              filter.fn,
              filter.args,
              initialImageUrl
            )}
          >
            {filter.name.charAt(0).toUpperCase() + filter.name.slice(1)}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

function MainPage() {
  const theme = useTheme();
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

  useEffect(() => {
    if (location.state?.imageURL) {
      setImageURL(location.state.imageURL);
      setInitialImageUrl(location.state.imageURL);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const handleCloseSnackbar = () => {
    setSnackbarState({ ...snackbarState, open: false });
  };

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 2, md: 15, lg: 15 },
        minHeight: "100vh",
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <InstallAlertDialog
        open={installDialogOpen}
        onClose={() => setInstallDialogOpen(false)}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {/* Switch de tema a la izquierda */}
        <ThemeToggleSwitch />

        {/* Botones Info + Gallery a la derecha */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {!window.matchMedia("(display-mode: standalone)").matches && (
            <IconButton
              aria-label="info-install"
              onClick={() => setInstallDialogOpen(true)}
              sx={{
                borderRadius: "50%",
                boxShadow: 4,
                background: `linear-gradient(135deg, ${theme.palette.primary.info} 60%, ${theme.palette.secondary.main} 100%)`,
                color: theme.palette.primary.highlightText,
                width: 40,
                height: 40,
                transition: "box-shadow 0.3s, filter 0.3s",
                filter: "drop-shadow(0 0 8px #fff8) brightness(1)",
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.palette.secondary.info} 60%, ${theme.palette.primary.main} 100%)`,
                },
              }}
            >
              <InfoIcon sx={{ fontSize: 32 }} />
            </IconButton>
          )}
          <Button
            variant="contained"
            onClick={() => navigate("/gallery")}
            sx={{
              borderRadius: 4,
              backgroundColor: theme.palette.primary.highlight,
              color: theme.palette.primary.highlightText,
              fontWeight: "bold",
            }}
          >
            Gallery <ArrowForwardIcon sx={{ ml: 1 }} />
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
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

      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          id="downloadButton"
          variant="contained"
          sx={{
            borderRadius: 4,
            flex: 1,
            backgroundColor: theme.palette.primary.highlight,
            color: theme.palette.primary.highlightText,
            fontWeight: "bold",
          }}
          disabled={!imageURL}
          startIcon={<DownloadIcon />}
          onClick={downloadImage(imageURL, "processed_image.png")}
        >
          Download
        </Button>
        <Button
          id="saveButton"
          variant="contained"
          sx={{
            borderRadius: 4,
            flex: 1,
            backgroundColor: theme.palette.primary.highlight,
            color: theme.palette.primary.highlightText,
            fontWeight: "bold",
          }}
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
          sx={{ width: "100%" }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>

      <Typography align="center" variant="body2" sx={{ opacity: "60%", mt: 4 }}>
        Welcome to ▸ <strong>Get Some Filters</strong> ◂ <br />
        Feel free to use any available filter. Upload, experiment, download —
        it's that simple.
      </Typography>
    </Box>
  );
}

export { MainPage };
