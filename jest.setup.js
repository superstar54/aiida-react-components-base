// jest.setup.js
require('@testing-library/jest-dom');
global.URL.createObjectURL = () => 'blob://dummy';

// Stub out canvas getContext so Plotly can render (no real drawing occurs)
HTMLCanvasElement.prototype.getContext = function() {
    return {
      // Minimal methods that Plotly’s code might call:
      fillRect: () => {},
      clearRect: () => {},
      getImageData: () => ({ data: [] }),
      putImageData: () => {},
      createImageData: () => [],
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      fill: () => {},
      // you can add more if Plotly errors for missing methods
    };
  };
