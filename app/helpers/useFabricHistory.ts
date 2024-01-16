import { Object } from "fabric/fabric-impl";

const useFabricHistory = (canvas: fabric.Canvas | undefined) => {
  let isRedoing = false;
  let history: (Object | undefined)[] = [];

  const historyReset = () => {
    if (!isRedoing) {
      history = [];
    }
    isRedoing = false;
  };

  canvas?.on("object:added", () => historyReset());

  const undo = () => {
    if (canvas && canvas._objects.length > 0) {
      history.push(canvas._objects.pop());
      canvas.renderAll();
    }
  };

  const redo = () => {
    if (history.length > 0) {
      isRedoing = true;
      canvas?.add(history.pop() as Object);
    }
  };

  return {
    undo,
    redo,
  };
};

export default useFabricHistory;
