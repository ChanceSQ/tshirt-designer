import { fabric } from "fabric";

const useAddObject = (canvas: fabric.Canvas | undefined) => {
  const addRect = () => {
    const rect = new fabric.Rect({
      height: 280,
      width: 200,
      fill: "blue",
    });
    canvas?.add(rect);
    canvas?.requestRenderAll();
    canvas?.fire("object:modified"); // Required for undo/redo
  };

  const addTri = () => {
    const rect = new fabric.Triangle({
      height: 150,
      width: 150,
      fill: "red",
    });
    canvas?.add(rect);
    canvas?.requestRenderAll();
    canvas?.fire("object:modified"); // Required for undo/redo
  };

  const addText = () => {
    const text = new fabric.Text("Hello World", {
      fontSize: 30,
      fill: "orange",
    });
    canvas?.add(text);
    canvas?.requestRenderAll();
    canvas?.fire("object:modified"); // Required for undo/redo
  };

  return {
    addRect,
    addTri,
    addText,
  };
};

export default useAddObject;
