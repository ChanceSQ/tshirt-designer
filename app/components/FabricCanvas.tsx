"use client";

import { useEffect, useState } from "react";
import { fabric } from "fabric";
import {
  useCanvasControls,
  useAddObject,
  useObjectControls,
  useFabricHistory,
} from "@/helpers/canvasFunctions";

const FabricCanvas = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const { undo, redo } = useFabricHistory(canvas);
  const { deleteActiveObjects, copy, cut, paste, lock } =
    useObjectControls(canvas);
  const { addRect, addTri, addText } = useAddObject(canvas);
  const { downloadCanvas } = useCanvasControls(canvas);

  const keyDownHandler = ({
    key,
    ctrlKey,
    metaKey,
  }: {
    key: string;
    ctrlKey: boolean;
    metaKey: boolean;
  }) => {
    switch (key) {
      case "Backspace":
        deleteActiveObjects();
        break;
      case "y" || "Y":
        (ctrlKey || metaKey) && redo();
        break;
      case "z" || "Z":
        (ctrlKey || metaKey) && undo();
        break;
      case "l" || "L":
        (ctrlKey || metaKey) && lock();
        break;
    }
  };

  window.addEventListener("keydown", (e) => {
    keyDownHandler(e);
  });

  window.addEventListener("paste", () => paste());
  window.addEventListener("copy", () => copy());
  window.addEventListener("cut", () => cut());
  window.addEventListener("undo", () => undo());

  useEffect(() => {
    const height = window.innerHeight;
    const width = window.innerWidth;

    const c = new fabric.Canvas("canvas", {
      height: height,
      width: width,
      preserveObjectStacking: true,
    });

    const resizeCanvas = () => {
      const newWidth = window.innerWidth <= 1000 ? window.innerWidth : 1000;
      const newHeight = window.innerHeight <= 1000 ? window.innerHeight : 1000;

      if (!c) {
        return;
      }

      if (c.width != newWidth || c.height != newHeight) {
        const scaleX = newWidth / c.width;
        const scaleY = newHeight / c.height;
        const scale = scaleX * scaleY;

        var objects = c.getObjects();
        for (var i in objects) {
          /**
           * @description Scale objects relative to the width of the canvas
           */
          objects[i].scaleX = objects[i].scaleX * scale;
          objects[i].scaleY = objects[i].scaleY * scale;
          /**
           * @description reposition objects relative to the width and height of the canvas
           */
          objects[i].left = objects[i].left * scale;
          objects[i].top = objects[i].top * scale;
          objects[i].setCoords();
        }
        var obj = c.backgroundImage;
        if (obj) {
          obj.scaleX = obj.scaleX * scaleX;
          obj.scaleY = obj.scaleY * scaleY;
        }

        c.discardActiveObject();
        c.setWidth(c.getWidth() * scaleX);
        c.setHeight(c.getHeight() * scaleY);
        c.renderAll();
        c.calcOffset();
      }
    };

    window.addEventListener("resize", resizeCanvas, false);

    // settings for all objects in the app
    fabric.Object.prototype.padding = 5;
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = "#007AFF";
    fabric.Object.prototype.cornerStyle = "rect";
    fabric.Object.prototype.cornerSize = 8;
    fabric.Object.prototype.borderColor = "#8fc5ff";
    fabric.Object.prototype.borderDashArray = [5, 5];
    fabric.Object.prototype.borderScaleFactor = 2;

    resizeCanvas();
    setCanvas(c);

    return () => {
      c.dispose();
      window.removeEventListener("resize", resizeCanvas, false);
      window.removeEventListener("keydown", (e) => {
        keyDownHandler(e);
      });
      window.removeEventListener("paste", () => paste());
      window.removeEventListener("copy", () => copy());
      window.removeEventListener("cut", () => cut());
      window.removeEventListener("undo", () => undo());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Fabric</h1>
      <button onClick={() => addRect()}>Add Rectangle</button>|
      <button onClick={() => addTri()}>Add Triangle</button>|
      <button onClick={() => addText()}>Add Text</button>|
      <button onClick={() => undo()}>Undo</button>
      <button onClick={() => redo()}>Redo</button>|
      <button onClick={() => copy()}>Copy</button>
      <button onClick={() => cut()}>Cut</button>
      <button onClick={() => paste()}>Paste</button>
      <button onClick={() => deleteActiveObjects()}>Delete</button>|
      <button onClick={() => downloadCanvas()}>Download Canvas</button>
      <button onClick={() => console.log("### canvas: ", canvas)}>Log</button>
      <div
        style={{
          background: `repeating-conic-gradient(#eee 0% 25%, #fff 0% 50%) 
        50% / 20px 20px`,
          width: "max-content",
        }}
      >
        <canvas id="canvas" />
      </div>
    </div>
  );
};

export default FabricCanvas;
