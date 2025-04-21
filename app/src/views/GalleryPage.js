import { Box, Typography, Button } from "@mui/material";
import SavedImagesGallery from "../components/SavedImagesGallery";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ThemeToggleSwitch from "../components/ThemeToggleSwitch";
import { useSxStyles } from "../styles/globalSxStyles";

function GalleryPage() {
  const navigate = useNavigate();
  const style = useSxStyles();
  const handleLoadSavedImage = (url) => {
    navigate("/", { state: { imageURL: url } });
  };

  return (
    <Box sx={style.mainGalleryContainer}>
      <Box sx={style.buttonGalleryContainer}>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={style.galleryButton}
        >
          Get Some Filters
        </Button>
        <ThemeToggleSwitch />
      </Box>

      <Typography variant="h4" component="h1" gutterBottom align="center">
        My Gallery
      </Typography>

      <SavedImagesGallery
        onImageSelect={handleLoadSavedImage}
        refreshTrigger={0}
      />
    </Box>
  );
}

export { GalleryPage };
