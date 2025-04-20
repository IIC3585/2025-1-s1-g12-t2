import Box from '@mui/material/Box';
import { styled, Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import init, { resize, grayscale, blur } from '../pkg/img.js';
import { useEffect } from 'react';

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

function downloadImage(imageData, fileName) {
    const blob = new Blob([imageData], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
}

function applyToImage(fn, args){
    return async () => {
        await init();
        const fileInput = document.getElementById('imageInput');
        const file = fileInput.files[0];
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const imageData = fn(new Uint8Array(arrayBuffer), ...args);
            downloadImage(imageData, 'processed_image.png');
        }
    }
}

function MainPage(){
    let sx = {
        padding: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }
    const buttonSx = {
        margin: 1,
        width: '200px',
    };

    let deferredPrompt;
    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            deferredPrompt = e;
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;
            if (choiceResult.outcome === 'accepted') {
                console.log('PWA installation accepted');
            } else {
                console.log('PWA installation dismissed');
            }
            deferredPrompt = null;
        }
    };

    return (
        <Box sx={sx}>
            <Typography variant="h4" component="h1" gutterBottom>
                Image Processing
            </Typography>
            <Button
                sx={buttonSx}
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
            >
                Upload Image
                <VisuallyHiddenInput
                    id="imageInput"
                    type="file"
                    onChange={(event) => console.log(event.target.files)}
                    multiple
                />
            </Button>
            <Button 
                id="resizeButton" 
                variant="contained"
                sx={buttonSx}
                onClick={applyToImage(resize, [200, 200])}
            >
                Resize
            </Button>
            <Button 
                id="grayScaleButton" 
                variant="contained"
                sx={buttonSx}
                onClick={applyToImage(grayscale, [])}
            >
                Gray Scale
            </Button>
            <Button 
                id="blurButton" 
                variant="contained"
                sx={buttonSx}
                onClick={applyToImage(blur, [5.0])}
            >
                Blur
            </Button>
            <Button 
                id="installButton" 
                variant="contained"
                sx={buttonSx}
                onClick={handleInstallClick}
            >
                Install
            </Button>
        </Box>
    );
}
export {MainPage}