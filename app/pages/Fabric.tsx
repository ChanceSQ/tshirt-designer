"use client";

import { useEffect, useState } from "react";
import { fabric } from "fabric";
import useFabricHistory from "../helpers/useFabricHistory";

const Fabric = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const { undo, redo } = useFabricHistory(canvas);

  // COPY / CUT / PASTE
  let clonedObject: fabric.Object | null = null;

  const copy = () => {
    canvas?.getActiveObject()?.clone((cloned: fabric.Object) => {
      clonedObject = cloned;
    });

    canvas?.discardActiveObject();
  };

  const cut = () => {
    canvas?.getActiveObject()?.clone((cloned: fabric.Object) => {
      clonedObject = cloned;
    });

    deleteActiveObjects();
  };

  const paste = () => {
    if (!canvas || !clonedObject) {
      return;
    }
    // clone again, so you we do multiple copies.
    clonedObject.clone((cloned: fabric.Object) => {
      clonedObject = cloned;
    });

    canvas.discardActiveObject();

    canvas?.add(clonedObject);
    canvas?.centerObject(clonedObject);

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

  window.addEventListener("paste", () => paste());
  window.addEventListener("copy", () => copy());
  window.addEventListener("cut", () => cut());
  window.addEventListener("undo", () => undo());

  const download = () => {
    const dataURL = canvas?.toDataURL({
      width: canvas.width,
      height: canvas.height,
      left: 0,
      top: 0,
      format: "png",
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
      const newWidth = window.innerWidth <= 1000 ? window.innerWidth : 1000;
      const newHeight = window.innerHeight <= 1000 ? window.innerHeight : 1000;

      if (!c) {
        return;
      }

      if (c.width != newWidth || c.height != newHeight) {
        const scaleX = newWidth / c.width;
        const scaleY = newHeight / c.height;
        var objects = c.getObjects();
        for (var i in objects) {
          // Optional Scaling of objects (if you want that)
          // objects[i].scaleX = objects[i].scaleX * scaleX;
          // objects[i].scaleY = objects[i].scaleY * scaleY;
          objects[i].left = objects[i].left * scaleX;
          objects[i].top = objects[i].top * scaleY;
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
      window.removeEventListener("paste", () => paste());
      window.removeEventListener("copy", () => copy());
      window.removeEventListener("cut", () => cut());
      window.removeEventListener("undo", () => undo());
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
      <button onClick={() => addRect(canvas)}>Add Rectangle</button>|
      <button onClick={() => undo()}>Undo</button>
      <button onClick={() => redo()}>Redo</button>|
      <button onClick={() => copy()}>Copy</button>
      <button onClick={() => cut()}>Cut</button>
      <button onClick={() => paste()}>Paste</button>
      <button onClick={() => deleteActiveObjects()}>Delete</button>|
      <button onClick={() => download()}>Download Canvas</button>
      <canvas id="canvas" />
    </div>
  );
};

export default Fabric;
