"use client";

import { useEffect, useState } from "react";
import { fabric } from "fabric";
import useFabricJSONHistory from "../helpers/useFabricJSONHistory";

const Fabric = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const { undo, redo } = useFabricJSONHistory(canvas);

  window.addEventListener("keydown", (e) => {
    e.key === "Backspace" && deleteActiveObject();
  });

  const deleteActiveObject = () => {
    const activeObject = canvas?.getActiveObject();
    canvas && activeObject && canvas?.remove(activeObject);
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
        e.key === "Backspace" && deleteActiveObject();
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
    canvas?.fire("object:modified"); // Required for undo/redo
    canvas?.requestRenderAll();
  };

  return (
    <div>
      <h1>Fabric</h1>
      <button onClick={() => addRect(canvas)}>Add Rectangle</button>
      <button onClick={() => undo()}>undo</button>
      <button onClick={() => redo()}>redo</button>
      <button onClick={() => deleteActiveObject()}>Delete</button>
      <canvas id="canvas" />
    </div>
  );
};

export default Fabric;
