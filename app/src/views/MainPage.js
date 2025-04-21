import Box from '@mui/material/Box';
import { styled, Button, Typography, Snackbar, Alert, Divider } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import ImageIcon from '@mui/icons-material/Image';
import init, { resize, grayscale, blur } from '../pkg/img.js';
import { useEffect, useState } from 'react';
import InstallAlertDialog from '../components/InstallAlertDialog.jsx';
import SaveImageDialog from '../components/SaveImageDialog.jsx';
import SavedImagesGallery from '../components/SavedImagesGallery.jsx';
import { saveImage } from '../services/indexedDBService.js';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const actionColor = '#5863cc';

function imageToUrl(imageData) {
    const blob = new Blob([imageData], { type: 'image/png' });
    return URL.createObjectURL(blob);
}

async function urlToBlob(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
}

function downloadImage(imageURL, fileName) {
    return async () => {
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = fileName;
        link.click();
    }
}

function applyToImage(setImageURL, fn, args){
    return async () => {
        await init();
        const fileInput = document.getElementById('imageInput');
        const file = fileInput.files[0];
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const imageData = fn(new Uint8Array(arrayBuffer), ...args);
            const imageURL = imageToUrl(imageData);
            setImageURL(imageURL);
            // downloadImage(imageData, 'processed_image.png');
        }
    }
}

function MediaBox({imageURL, setImageURL}){
    const hoverColor = actionColor;
    const mediaBoxSx = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: {xs: '100%', sm: '100%', md: '100%', lg: '200%'},
        height: 500,
        border: '2px dashed',
        borderColor: '#ccc',
        borderRadius: 4,
        backgroundColor: '#f5f5f5',
        color: '#cccccc',
        '&:hover': {
            borderColor: hoverColor,
            cursor: 'pointer',
        },
        '&:hover .child': {
            color: hoverColor, // Change child styles on hover
        }
    };
    const imageBoxSx = {
        objectFit: "contain",
        maxHeight: '90%',
        maxWidth: '90%',
    }
    let image = <Box component="img"
        sx={imageBoxSx}
        alt="The house from the offer."
        src={imageURL}
    />
    let initialMessage = <>
        <ImageIcon className='child' fontSize='inherit' style={{ fontSize: '10rem' }}/>
        <Typography className='child' variant="h6" component="h2" gutterBottom>
            Click to upload an image
        </Typography>
    </>
    return (<Box sx={mediaBoxSx} onClick={() => document.getElementById('imageInput').click()}>
        {imageURL ? image : initialMessage}
        <VisuallyHiddenInput
                id="imageInput"
                type="file"
                onChange={(event) => {
                    const file = event.target.files[0];
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    console.log(url);
                    setImageURL(url);
                    }}
                multiple
            />
    </Box>)
}

function FiltersMenu({imageURL, setImageURL}){
    let menuBoxSx = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'top',
        width: '100%',
        border: '2px solid',
        borderColor: '#ccc',
        borderRadius: 4,
        
    }
    let filtersBoxSx = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        border: '2px #ccc',
        borderRadius: 4,
        gap: 1.5,
        margin: 2,
    }
    const buttonSx = {
        width: '100%',
        backgroundColor: actionColor,
        borderRadius: 4,
    };
    const imgFilterFunctions = [
        { name: 'resize', fn: resize, args: [200, 200] },
        { name: 'grayscale', fn: grayscale, args: [] },
        { name: 'blur', fn: blur, args: [5.0] },
    ]
    return <Box sx={menuBoxSx}>
            <Typography variant="h6" component="h2" sx={{margin: 1}}>
                    Filter to apply
            </Typography>
            <Box sx={filtersBoxSx}>
                {imgFilterFunctions.map((filter, index) => (
                    <Button 
                        key={index} 
                        id={`${filter.name}Button`} 
                        variant="contained"
                        sx={buttonSx}
                        disabled={imageURL ? false :  true}
                        onClick={applyToImage(setImageURL, filter.fn, filter.args)}
                    >
                        {filter.name.charAt(0).toUpperCase() + filter.name.slice(1)}
                    </Button>
                ))}
            </Box>
        </Box>;
}

function MainPage(){
    let containerSx = {
        display: 'flex',
        flexDirection: {
            xs:'column', 
            sm: 'column', 
            md: 'row', 
            lg: 'row'
        },
        alignItems: 'stretch',
        height: '100%',
        justifyContent: 'center',
        gap: 2,
    }
    
    const [imageURL, setImageURL] = useState(null);
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [galleryRefreshTrigger, setGalleryRefreshTrigger] = useState(0);

    // Function to handle saving an image
    const handleSaveImage = async (imageName) => {
        try {
            // Convert image URL to blob for storing in IndexedDB
            const imageBlob = await urlToBlob(imageURL);
            
            // Save image to IndexedDB
            await saveImage(imageBlob, imageName);
            
            // Trigger gallery refresh by incrementing the counter
            setGalleryRefreshTrigger(prev => prev + 1);
            
            // Close dialog and show success message
            setSaveDialogOpen(false);
            setSnackbarState({
                open: true,
                message: 'Image saved successfully!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error saving image:', error);
            setSnackbarState({
                open: true,
                message: 'Failed to save image. Please try again.',
                severity: 'error'
            });
        }
    };

    // Handler for loading a saved image into the editor
    const handleLoadSavedImage = (url) => {
        setImageURL(url);
        
        // Scroll to top to show the loaded image
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbarState({
            ...snackbarState,
            open: false
        });
    };

    return (
        <Box sx={{py: 2, px: {xs: 2, sm: 2, md: 15, lg: 15}, height: '100%'}}>
            {(window.matchMedia('(display-mode: standalone)').matches) ? null : <InstallAlertDialog/>}
            <Typography variant="h4" component="h1" gutterBottom align='center'>
                Image Processing
            </Typography>
            <Box sx={containerSx}>
                <MediaBox imageURL={imageURL} setImageURL={setImageURL}/>
                <FiltersMenu imageURL={imageURL} setImageURL={setImageURL}/>      
            </Box>
            
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button 
                    id="downloadButton" 
                    variant="contained"
                    sx={{ borderRadius: 4, flex: 1, backgroundColor: actionColor}}
                    disabled={imageURL ? false :  true}
                    startIcon={<DownloadIcon/>}
                    onClick={downloadImage(imageURL, 'processed_image.png')}
                >
                    Download
                </Button>
                <Button 
                    id="saveButton" 
                    variant="contained"
                    sx={{ borderRadius: 4, flex: 1, backgroundColor: actionColor}}
                    disabled={imageURL ? false :  true}
                    startIcon={<SaveIcon/>}
                    onClick={() => setSaveDialogOpen(true)}
                >
                    Save to Gallery
                </Button>
            </Box>
            
            {/* Divider between editor and gallery */}
            <Divider sx={{ my: 4 }} />
            
            {/* Saved Images Gallery */}
            <SavedImagesGallery 
                onImageSelect={handleLoadSavedImage} 
                refreshTrigger={galleryRefreshTrigger} 
            />
            
            {/* Save Image Dialog */}
            <SaveImageDialog 
                open={saveDialogOpen}
                onClose={() => setSaveDialogOpen(false)}
                onSave={handleSaveImage}
                previewUrl={imageURL}
            />
            
            {/* Notification Snackbar */}
            <Snackbar 
                open={snackbarState.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbarState.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbarState.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
export {MainPage}