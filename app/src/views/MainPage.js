import Box from '@mui/material/Box';
import { styled, Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import init, { resize, grayscale, blur } from '../pkg/img.js';
import { useEffect, useState } from 'react';

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

const buttonSx = {
    margin: 1,
    width: '90%',
};

function imageToUrl(imageData) {
    const blob = new Blob([imageData], { type: 'image/png' });
    return URL.createObjectURL(blob);
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
    const hoverColor = '#5863cc';
    const mediaBoxSx = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
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

function MainPage(){
    let sx = {
        padding: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
    }
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
    const [imageURL, setImageURL] = useState(null);
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
    let menuBoxSx = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        border: '2px solid',
        borderColor: '#ccc',
        borderRadius: 4,
    }
    let filtersBoxSx = {
        display: 'flex',
        flexDirection: { xs:'column', sm: 'column', md: 'row'},
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        border: '2px #ccc',
        borderRadius: 4,
    }
    return (
        <Box sx={sx}>
            <Typography variant="h4" component="h1" gutterBottom>
                Image Processing
            </Typography>
            <MediaBox imageURL={imageURL} setImageURL={setImageURL}/>
            <Box sx={menuBoxSx}>
                <Typography variant="h6" component="h2">
                        Filters
                </Typography>
                <Box sx={filtersBoxSx}>
                    <Button 
                        id="resizeButton" 
                        variant="contained"
                        sx={buttonSx}
                        onClick={applyToImage(setImageURL, resize, [200, 200])}
                    >
                        Resize
                    </Button>
                    <Button 
                        id="grayScaleButton" 
                        variant="contained"
                        sx={buttonSx}
                        onClick={applyToImage(setImageURL, grayscale, [])}
                    >
                        Gray Scale
                    </Button>
                    <Button 
                        id="blurButton" 
                        variant="contained"
                        sx={buttonSx}
                        onClick={applyToImage(setImageURL, blur, [5.0])}
                    >
                        Blur
                    </Button>
                </Box>
            </Box>
            <Button 
                id="downloadButton" 
                variant="contained"
                sx={buttonSx}
                onClick={downloadImage(imageURL, 'processed_image.png')}
            >
                Download
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