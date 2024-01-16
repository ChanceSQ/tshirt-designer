const useFabricHistory = (canvas: fabric.Canvas | undefined) => {
  let pointer = 0;
  let history: string[] = [JSON.stringify(canvas)];

  const handleChange = () => {
    // saves current canvas state as a JSON string
    const json = JSON.stringify(canvas);
    // removes history ahead of pointer
    history = history.slice(0, pointer + 1);
    // pushes current state to history
    history.push(json);
    // sets pointer to last index
    pointer = history.length - 1;
  };

  canvas?.on("object:modified", () => handleChange());

  const undo = () => {
    pointer > 0 && pointer--;
    canvas?.loadFromJSON(history[pointer], () => canvas?.renderAll());
  };

  const redo = () => {
    pointer < history.length - 1 && pointer++;
    canvas?.loadFromJSON(history[pointer], () => canvas?.renderAll());
  };

  return {
    undo,
    redo,
  };
};

export default useFabricHistory;
