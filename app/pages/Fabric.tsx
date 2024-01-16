"use client";

import { useEffect, useState } from "react";
import { fabric } from "fabric";
import useFabricHistory from "../helpers/useFabricHistory";

const Fabric = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const { undo, redo } = useFabricHistory(canvas);

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
        (ctrlKey || metaKey) && console.log("CTRL+C");
        break;
      case "v" || "V":
        (ctrlKey || metaKey) && console.log("CTRL+V");
        break;
    }
  };

  window.addEventListener("keydown", (e) => {
    keyDownHandler(e);
  });

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
        e.key === "Backspace" && deleteActiveObjects();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addRect = (canvas?: fabric.Canvas) => {
    const rect = new fabric.Rect({
      height: 280,
      width: 200,
      stroke: "#2BEBC8",
    });
    canvas?.add(rect);
    canvas?.requestRenderAll();
    canvas?.fire("object:modified"); // Required for undo/redo
  };

  return (
    <div>
      <h1>Fabric</h1>
      <button onClick={() => addRect(canvas)}>Add Rectangle</button>
      <button onClick={() => undo()}>undo</button>
      <button onClick={() => redo()}>redo</button>
      <button onClick={() => deleteActiveObjects()}>Delete</button>
      <canvas id="canvas" />
    </div>
  );
};

export default Fabric;
