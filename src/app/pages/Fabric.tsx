"use client";

import { useEffect, useState } from "react";
import { fabric } from "fabric";

const Fabric = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas>();

  useEffect(() => {
    const height = window.innerHeight;
    const width = window.innerWidth;

    const resizeCanvas = () => {
      c.setHeight(window.innerHeight);
      c.setWidth(window.innerWidth);
      c.renderAll();
    };

    window.addEventListener("resize", resizeCanvas, false);

    const c = new fabric.Canvas("canvas", {
      height: height - 500,
      width: width,
      backgroundColor: "white",
    });

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
    };
  }, []);

  const addRect = (canvas?: fabric.Canvas) => {
    const rect = new fabric.Rect({
      height: 280,
      width: 200,
      stroke: "#2BEBC8",
    });
    canvas?.add(rect);
    canvas?.requestRenderAll();
  };

  return (
    <div>
      <h1>Fabric</h1>
      <button onClick={() => addRect(canvas)}>Add Rectangle</button>
      <canvas id="canvas" />
    </div>
  );
};

export default Fabric;
