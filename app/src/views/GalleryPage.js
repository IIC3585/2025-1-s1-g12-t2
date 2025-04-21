import React from "react";
import { Box, Typography, Button } from "@mui/material";
import SavedImagesGallery from "../components/SavedImagesGallery";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ThemeToggleSwitch from "../components/ThemeToggleSwitch";
import { useTheme } from "@mui/material/styles";

function GalleryPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLoadSavedImage = (url) => {
    navigate("/", { state: { imageURL: url } });
  };

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 2, md: 15, lg: 15 },
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        py: 4,
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{
            backgroundColor: theme.palette.primary.highlight,
            color: theme.palette.primary.highlightText,
          }}
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
