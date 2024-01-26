"use client";

import { useEffect, useState } from "react";
import { fabric } from "fabric";
import useFabricHistory from "../helpers/useFabricHistory";

const Fabric = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const { undo, redo } = useFabricHistory(canvas);

  // COPY / PASTE
  let clonedObject = null;

  const copy = () => {
    canvas?.getActiveObject()?.clone((cloned) => {
      clonedObject = cloned;
    });
  };

  const paste = () => {
    if (!canvas || !clonedObject) {
      return;
    }
    // clone again, so you we do multiple copies.
    clonedObject.clone((cloned) => {
      clonedObject = cloned;
    });

    canvas.discardActiveObject();

    canvas?.add(clonedObject);
    canvas?.centerObject(clonedObject);
    canvas?.renderAll();
    canvas?.fire("object:modified");
  };

  //

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
      case "c" || "C":
        (ctrlKey || metaKey) && copy();
        break;
      case "v" || "V":
        (ctrlKey || metaKey) && paste();
        break;
      case "y" || "Y":
        (ctrlKey || metaKey) && redo();
        break;
      case "z" || "Z":
        (ctrlKey || metaKey) && undo();
        break;
    }
  };

  window.addEventListener("keydown", (e) => {
    keyDownHandler(e);
  });

  const download = () => {
    const dataURL = canvas.toDataURL({
      width: canvas.width,
      height: canvas.height,
      left: 0,
      top: 0,
      format: "png",
    });
    const link = document.createElement("a");
    link.download = "image.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteActiveObjects = () => {
    const activeObjects = canvas?.getActiveObjects();
    if (canvas && activeObjects?.length) {
      activeObjects.forEach((object) => canvas.remove(object));
      canvas?.discardActiveObject().renderAll();
      canvas?.fire("object:modified"); // Required for undo/redo
    }
  };

  useEffect(() => {
    const height = window.innerHeight;
    const width = window.innerWidth;

    const c = new fabric.Canvas("canvas", {
      height: height,
      width: width,
      backgroundColor: "white",
    });

    const resizeCanvas = () => {
      c.setHeight(window.innerHeight);
      c.setWidth(window.innerWidth);
      c.renderAll();
    };

    window.addEventListener("resize", resizeCanvas, false);

    // settings for all canvas in the app
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = "#2BEBC8";
    fabric.Object.prototype.cornerStyle = "rect";
    fabric.Object.prototype.cornerStrokeColor = "#2BEBC8";
    fabric.Object.prototype.cornerSize = 6;

    resizeCanvas();
    setCanvas(c);

    return () => {
      c.dispose();
      window.removeEventListener("resize", resizeCanvas, false);
      window.removeEventListener("keydown", (e) => {
        keyDownHandler(e);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addRect = (canvas?: fabric.Canvas) => {
    const rect = new fabric.Rect({
      height: 280,
      width: 200,
    });
    canvas?.add(rect);
    canvas?.requestRenderAll();
    canvas?.fire("object:modified"); // Required for undo/redo
  };

  return (
    <div>
      <h1>Fabric</h1>
      <button onClick={() => addRect(canvas)}>Add Rectangle</button>
      <button onClick={() => undo()}>Undo</button>
      <button onClick={() => redo()}>Redo</button>
      <button onClick={() => deleteActiveObjects()}>Delete</button>
      <button onClick={() => download()}>Download</button>
      <canvas id="canvas" />
    </div>
  );
};

export default Fabric;
