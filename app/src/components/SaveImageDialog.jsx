import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Box
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

function SaveImageDialog({ open, onClose, onSave, previewUrl }) {
  const [imageName, setImageName] = useState('');

  const handleSave = () => {
    onSave(imageName || `Image_${new Date().toLocaleString()}`);
    setImageName('');
  };

  const handleCancel = () => {
    onClose();
    setImageName('');
  };

  const handleChange = (event) => {
    setImageName(event.target.value);
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Save Image</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter a name for your image to save it to your local storage.
        </DialogContentText>
        
        {previewUrl && (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 2, 
              mb: 2,
              maxHeight: '200px',
              overflow: 'hidden'
            }}
          >
            <img 
              src={previewUrl} 
              alt="Preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px', 
                objectFit: 'contain' 
              }} 
            />
          </Box>
        )}
        
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Image Name"
          type="text"
          fullWidth
          variant="outlined"
          value={imageName}
          onChange={handleChange}
          placeholder="My awesome edited image"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          color="primary" 
          variant="contained"
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SaveImageDialog;