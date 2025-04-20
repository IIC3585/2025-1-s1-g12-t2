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

const actionColor = '#5863cc';

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

function FiltersMenu({setImageURL}){
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
        gap: 2,
        margin: 2,
    }
    const buttonSx = {
        width: '100%',
        backgroundColor: actionColor,
    };
    const imgFilterFunctions = [
        { name: 'resize', fn: resize, args: [200, 200] },
        { name: 'grayscale', fn: grayscale, args: [] },
        { name: 'blur', fn: blur, args: [5.0] },
    ]
    return <Box sx={menuBoxSx}>
            <Typography variant="h6" component="h2" sx={{margin: 1}}>
                    Filters to apply
            </Typography>
            <Box sx={filtersBoxSx}>
                {imgFilterFunctions.map((filter, index) => (
                    <Button 
                        key={index} 
                        id={`${filter.name}Button`} 
                        variant="contained"
                        sx={buttonSx}
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
    
    
    return (
        <Box sx={{py: 2, px: {xs: 2, sm: 2, md: 15, lg: 15}, height: '100%'}}>
            <Typography variant="h4" component="h1" gutterBottom align='center'>
                Image Processing
            </Typography>
            <Box sx={containerSx}>
                <MediaBox imageURL={imageURL} setImageURL={setImageURL}/>
                <FiltersMenu setImageURL={setImageURL}/>      
            </Box>
            <Button 
                    id="downloadButton" 
                    variant="contained"
                    sx={{marginTop: 2, width: '100%', backgroundColor: actionColor}}
                    onClick={downloadImage(imageURL, 'processed_image.png')}
                >
                    Download image
                </Button>
        </Box>
    );
}
export {MainPage}