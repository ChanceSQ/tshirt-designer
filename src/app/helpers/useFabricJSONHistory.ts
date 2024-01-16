const useFabricJSONHistory = (canvas: fabric.Canvas | undefined) => {
  let pointer = 0;
  let history: string[] = [];

  const handleChange = () => {
    console.log("### MODIFIED");
    const json = JSON.stringify(canvas);
    history = history.slice(0, pointer + 1);
    history.push(json);
    pointer = history.length - 1;
  };

  canvas?.on("object:modified", () => handleChange());

  const undo = () => {
    console.log("### pointer: ", pointer);
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

export default useFabricJSONHistory;
