import AlertDialogSlide from "./AlertDialogSlide";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";

function InstallAlertDialog(){
    const title = 'Do you want to install this app?'
    const contentText = 'This app is a PWA and can be installed on your device for offline use.'
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
    let installButton = <Button id="installButton" variant="contained" onClick={handleInstallClick}> Install </Button>
    let maybeLaterButton = <Button id="maybeLaterButton" variant="outlined" onClick={() => {}}> Maybe Later </Button>
    return (<AlertDialogSlide title={title} contentText={contentText} buttons={[maybeLaterButton, installButton]}/>)
}
export default InstallAlertDialog;