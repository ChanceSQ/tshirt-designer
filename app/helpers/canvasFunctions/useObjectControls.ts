const useObjectControls = (canvas: fabric.Canvas | undefined) => {
  let clonedObject: fabric.Object | null = null;

  const deleteActiveObjects = () => {
    const activeObjects = canvas?.getActiveObjects();
    if (canvas && activeObjects?.length) {
      activeObjects.forEach((object) => canvas.remove(object));
      canvas?.discardActiveObject().renderAll();
      canvas?.fire("object:modified"); // Required for undo/redo
    }
  };

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

  const lock = () => {
    const activeObjects = canvas?.getActiveObjects();

    if (canvas && activeObjects?.length) {
      activeObjects.forEach((object) => {
        object.lockMovementX = !object.lockMovementX;
        object.lockMovementY = !object.lockMovementY;
        object.lockRotation = !object.lockRotation;
        object.lockScalingX = !object.lockScalingX;
        object.lockScalingY = !object.lockScalingY;
        object.lockUniScaling = !object.lockUniScaling;
        object.lockSkewingX = !object.lockSkewingX;
        object.lockSkewingY = !object.lockSkewingY;
        object.lockScalingFlip = !object.lockScalingFlip;
      });
    }

    canvas?.discardActiveObject().renderAll();
  };

  return {
    deleteActiveObjects,
    copy,
    cut,
    paste,
    lock,
  };
};

export default useObjectControls;
