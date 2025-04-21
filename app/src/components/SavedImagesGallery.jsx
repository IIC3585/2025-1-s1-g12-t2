import React, { useState, useEffect } from 'react';
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
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import { getAllImages, deleteImage, blobToURL } from '../services/indexedDBService';

function SavedImagesGallery({ onImageSelect, refreshTrigger }) {
  const [savedImages, setSavedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
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
      const imagesWithURLs = images.map(img => ({
        ...img,
        url: blobToURL(img.imageBlob)
      }));
      
      setSavedImages(imagesWithURLs);
    } catch (error) {
      console.error('Error loading saved images:', error);
      setSnackbar({
        open: true,
        message: 'Error loading saved images',
        severity: 'error'
      });
    }
  };

  // Handle image selection
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenDialog(true);
  };

  // Handle image deletion
  const handleDeleteImage = async (id, event) => {
    event.stopPropagation(); // Prevent opening the dialog
    
    try {
      await deleteImage(id);
      // Refresh the image list
      await loadSavedImages();
      setSnackbar({
        open: true,
        message: 'Image deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting image',
        severity: 'error'
      });
    }
  };

  // Handle image download
  const handleDownloadImage = (image, event) => {
    event.stopPropagation(); // Prevent opening the dialog
    
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.name || 'downloaded-image.png';
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

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Saved Images
      </Typography>
      
      {savedImages.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center" sx={{ my: 2 }}>
          No saved images found
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {savedImages.map((image) => (
            <Grid item xs={6} sm={4} md={3} key={image.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 6,
                    cursor: 'pointer'
                  }
                }}
                onClick={() => handleImageClick(image)}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={image.url}
                  alt={image.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                  <Typography variant="body2" noWrap>
                    {image.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(image.date).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton 
                    size="small"
                    onClick={(e) => handleDeleteImage(image.id, e)}
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
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedImage && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">{selectedImage.name}</Typography>
              <IconButton onClick={handleCloseDialog} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box
                component="img"
                sx={{
                  width: '100%',
                  maxHeight: 500,
                  objectFit: 'contain',
                }}
                src={selectedImage.url}
                alt={selectedImage.name}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Saved on: {new Date(selectedImage.date).toLocaleString()}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={handleLoadIntoEditor} 
                variant="contained"
                color="primary"
              >
                Edit This Image
              </Button>
              <Button 
                onClick={() => handleDownloadImage(selectedImage, { stopPropagation: () => {} })}
                variant="outlined"
                startIcon={<DownloadIcon />}
              >
                Download
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SavedImagesGallery;