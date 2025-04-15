import logo from './logo.svg';
import './App.css';

import init, { resize, grayscale, blur } from './pkg/img.js';

async function main() {
  await init();
  const fileInput = document.getElementById('imageInput');
  const resizeButton = document.getElementById('resizeButton');
  const grayscaleButton = document.getElementById('grayscaleButton');
  const blurButton = document.getElementById('blurButton');
  resizeButton.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const resizedImage = resize(new Uint8Array(arrayBuffer), 200, 200);
      downloadImage(resizedImage, 'resized_image.png');
    }
  });
  grayscaleButton.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const grayImage = grayscale(new Uint8Array(arrayBuffer));
      downloadImage(grayImage, 'gray_image.png');
    }
  });
  blurButton.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const blurredImage = blur(new Uint8Array(arrayBuffer), 5.0);
      downloadImage(blurredImage, 'blurred_image.png');
    }
  });
  function downloadImage(imageData, fileName) {
    const blob = new Blob([imageData], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  }
}


function App() {
  main();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
