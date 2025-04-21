import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import FilterIcon from "@mui/icons-material/FilterAlt";
import StarIcon from "@mui/icons-material/Star";
import { useTheme } from "@mui/material/styles";
import {
  getAllImages,
  deleteImage,
  blobToURL,
} from "../services/indexedDBService";

function SavedImagesGallery({ onImageSelect, refreshTrigger }) {
  const [savedImages, setSavedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Load saved images when component mounts or refreshTrigger changes
  useEffect(() => {
    loadSavedImages();
  }, [refreshTrigger]);

  // Function to load all saved images
  const loadSavedImages = async () => {
    try {
      const images = await getAllImages();

      // Create URLs for each image blob
      const imagesWithURLs = images.map((img) => ({
        ...img,
        url: blobToURL(img.imageBlob),
      }));

      setSavedImages(imagesWithURLs);
    } catch (error) {
      console.error("Error loading saved images:", error);
      setSnackbar({
        open: true,
        message: "Error loading saved images",
        severity: "error",
      });
    }
  };

  // Handle image selection
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenDialog(true);
  };

  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  // Handle opening delete confirmation dialog
  const handleDeleteClick = (id, event) => {
    event.stopPropagation(); // Prevent opening the preview dialog
    setImageToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Handle image deletion
  const handleDeleteImage = async () => {
    try {
      await deleteImage(imageToDelete);
      // Refresh the image list
      await loadSavedImages();
      setSnackbar({
        open: true,
        message: "Image deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      setSnackbar({
        open: true,
        message: "Error deleting image",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setImageToDelete(null);
    }
  };

  // Handle image download
  const handleDownloadImage = (image, event) => {
    event.stopPropagation(); // Prevent opening the dialog

    const link = document.createElement("a");
    link.href = image.url;
    link.download = image.name || "downloaded-image.png";
    link.click();
  };

  // Handle loading image into editor
  const handleLoadIntoEditor = () => {
    if (selectedImage && onImageSelect) {
      onImageSelect(selectedImage.url);
      setOpenDialog(false);
    }
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const theme = useTheme();
  return (
    <Box sx={{ mt: 4 }}>
      {savedImages.length === 0 ? (
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ my: 2, opacity: 0.5 }}
        >
          Your gallery is empty.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {savedImages.map((image) => (
            <Grid item xs={6} sm={4} md={3} key={image.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    boxShadow: 6,
                    cursor: "pointer",
                  },
                }}
                onClick={() => handleImageClick(image)}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={image.url}
                  alt={image.name}
                  sx={{ objectFit: "cover", backgroundColor: "white" }}
                />
                <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                  <Typography variant="body2" noWrap>
                    {image.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(image.date).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <IconButton
                    size="small"
                    onClick={(e) => handleDeleteClick(image.id, e)}
                    aria-label="delete"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => handleDownloadImage(image, e)}
                    aria-label="download"
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Image Preview Dialog */}

      {selectedImage && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              m: { xs: 1, sm: 2 },
              width: { xs: "98vw", sm: "90vw", md: "70vw" },
              maxWidth: { xs: "100vw", sm: "90vw", md: "600px" },
              maxHeight: { xs: "95vh", sm: "90vh", md: "90vh" },
              p: { xs: 1, sm: 2 },
              borderRadius: 3,
            },
          }}
        >
          <DialogTitle
            sx={{ textAlign: "center", fontSize: { xs: 16, sm: 20 } }}
          >
            {selectedImage.name}
          </DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: { xs: 1, sm: 2 },
              borderRadius: 2,
              width: "100%",
              maxWidth: { xs: "95vw", sm: "90vw", md: "600px" },
              boxSizing: "border-box",
            }}
          >
            <Box
              component="img"
              src={selectedImage.url}
              alt={selectedImage.name}
              sx={{
                width: "100%",
                maxWidth: { xs: "90vw", sm: 400 },
                maxHeight: { xs: 250, sm: 350 },
                borderRadius: 2,
                boxShadow: 2,
                mb: 2,
                backgroundColor: theme.palette.primary.highlightText,
                objectFit: "contain",
              }}
            />
            <Divider sx={{ width: "100%", my: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Date: {new Date(selectedImage.date).toLocaleString("en-US")}
            </Typography>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: "space-between",
              px: { xs: 1, sm: 3 },
              pb: { xs: 1, sm: 2 },
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() =>
                handleDeleteClick(selectedImage.id, {
                  stopPropagation: () => {},
                })
              }
              sx={{
                mx: 1,
                borderRadius: 2,
                minWidth: 80,
                color: "#fff",
                backgroundColor: theme.palette.error.main,
                fontSize: { xs: 12, sm: 14 },
              }}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              startIcon={<StarIcon />}
              onClick={handleLoadIntoEditor}
              sx={{
                mr: 1,
                ml: 0,
                mb: 0,
                mt: 0,
                borderRadius: 2,
                minWidth: 100,
                backgroundColor: theme.palette.primary.highlight,
                color: theme.palette.primary.highlightText,
                fontSize: { xs: 12, sm: 14 },
              }}
            >
              Add Some Filter
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={(e) => handleDownloadImage(selectedImage, e)}
              sx={{
                ml: 1,
                borderRadius: 2,
                minWidth: 80,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontSize: { xs: 12, sm: 14 },
              }}
            >
              Download
            </Button>
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm deletion?</DialogTitle>
        <DialogContent id="delete-dialog-description">
          <Typography>
            Are you sure you want to delete this image? <br />
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteImage} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SavedImagesGallery;
