import { VisuallyHiddenInput } from "../components/styledComponents.js";
import init, { resize, grayscale, blur } from "../pkg/img.js";
import { Box, Button, Typography } from "@mui/material";
import { Image as ImageIcon } from "@mui/icons-material";
import { useSxStyles } from "../styles/globalSxStyles";

function imageToUrl(imageData) {
  const blob = new Blob([imageData], { type: "image/png" });
  return URL.createObjectURL(blob);
}

async function urlToBlob(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return blob;
}

function downloadImage(imageURL, fileName) {
  return async () => {
    const link = document.createElement("a");
    link.href = imageURL;
    link.download = fileName;
    link.click();
  };
}

function applyToImage(setImageURL, fn, args, initialImageUrl) {
  return async () => {
    await init();
    const fileInput = document.getElementById("imageInput");
    let arrayBuffer;

    if (fileInput.files[0]) {
      arrayBuffer = await fileInput.files[0].arrayBuffer();
    } else if (initialImageUrl) {
      const response = await fetch(initialImageUrl);
      const blob = await response.blob();
      arrayBuffer = await blob.arrayBuffer();
    }

    if (arrayBuffer) {
      const imageData = fn(new Uint8Array(arrayBuffer), ...args);
      const imageURL = imageToUrl(imageData);
      setImageURL(imageURL);
    }
  };
}

function MediaBox({ imageURL, setImageURL, setInitialImageUrl }) {
  const style = useSxStyles();
  let image = (
    <Box
      component="img"
      sx={style.imageBox}
      alt="Image preview"
      src={imageURL}
    />
  );
  let initialMessage = (
    <>
      <ImageIcon
        className="child"
        fontSize="inherit"
        style={{ fontSize: "10rem" }}
      />
      <Typography className="child" variant="h6" component="h2" gutterBottom>
        Click to upload an image
      </Typography>
    </>
  );

  return (
    <Box
      sx={style.mediaBox}
      onClick={() => document.getElementById("imageInput").click()}
    >
      {imageURL ? image : initialMessage}
      <VisuallyHiddenInput
        id="imageInput"
        type="file"
        onChange={(event) => {
          const file = event.target.files[0];
          if (!file) return;
          const url = URL.createObjectURL(file);
          setImageURL(url);
          setInitialImageUrl(url);
        }}
        multiple
      />
    </Box>
  );
}

function FiltersMenu({ imageURL, setImageURL, initialImageUrl }) {
  const style = useSxStyles();
  const imgFilterFunctions = [
    { name: "resize", fn: resize, args: [200, 200] },
    { name: "grayscale", fn: grayscale, args: [] },
    { name: "blur", fn: blur, args: [5.0] },
  ];

  return (
    <Box sx={style.menuBox}>
      <Typography variant="h5" component="h2" sx={{ margin: 1 }}>
        ⊷ Available Filter ⊶
      </Typography>
      <Box sx={style.filtersBox}>
        {imgFilterFunctions.map((filter, index) => (
          <Button
            key={index}
            id={`${filter.name}Button`}
            variant="contained"
            sx={style.filterButton}
            disabled={!imageURL}
            onClick={applyToImage(
              setImageURL,
              filter.fn,
              filter.args,
              initialImageUrl
            )}
          >
            {filter.name.charAt(0).toUpperCase() + filter.name.slice(1)}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

export { MediaBox, urlToBlob, downloadImage, FiltersMenu };
