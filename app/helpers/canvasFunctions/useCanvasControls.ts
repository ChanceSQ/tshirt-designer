import { fabric } from "fabric";

const useCanvasControls = (canvas: fabric.Canvas | undefined) => {
  const downloadCanvas = () => {
    const dataURL = canvas?.toDataURL({
      width: canvas.width,
      height: canvas.height,
      left: 0,
      top: 0,
      format: "png",
      multiplier: 8,
    });

    if (!dataURL) {
      return;
    }

    const link = document.createElement("a");
    link.download = "image.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    downloadCanvas,
  };
};

export default useCanvasControls;
