figma.showUI(__html__);

figma.ui.onmessage = msg => {
  if (msg.type === 'select') {
    selectBetweenElements();
  }

  figma.closePlugin();
};

interface ICoordinates {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

function selectBetweenElements() {
  const selection = figma.currentPage.selection;
  if (selection.length !== 2) {
    figma.notify('Please select 2 elements');
    return;
  }

  const element1 = selection[0];
  const element2 = selection[1];

  const hasGroupedParent =
    element1.parent?.type === 'GROUP' && element2.parent?.type === 'GROUP';
  const hasSameParent = element1.parent?.id === element2.parent?.id;

  if (!element1.parent || !element2.parent || !hasGroupedParent) {
    figma.notify('Please select 2 elements within Group');
    return;
  }

  if (!hasSameParent) {
    figma.notify('Please select 2 elements directly under same Group');
    return;
  }

  const selectionRectCoords: ICoordinates = toSelectionRectCoords(
    element1,
    element2
  );

  const groupNodes = element1.parent.children;
  const parentGroupRectCoords = toRectCoords(element1.parent as GroupNode);

  const betweenSelections = groupNodes.filter(el => {
    const elRectCoords = toRectCoords(el);
    // TODO: make isSameSizeAsGroup as optional
    const isSameSizeAsGroup =
      JSON.stringify(parentGroupRectCoords) === JSON.stringify(elRectCoords);

    return (
      !isSameSizeAsGroup &&
      detectRectCollision(selectionRectCoords, elRectCoords)
    );
  });

  if (betweenSelections.length < 3) {
    figma.notify('could not find');
    return;
  }

  figma.currentPage.selection = betweenSelections;
}

function toSelectionRectCoords(
  selection1: SceneNode,
  selection2: SceneNode
): ICoordinates {
  const coords1 = toRectCoords(selection1);
  const coords2 = toRectCoords(selection2);
  return {
    top: Math.min(coords1.top, coords2.top), // use min because figma's y value gets smaller towards top
    bottom: Math.max(coords1.bottom, coords2.bottom), // use max because figma's y value gets larger towards bottom
    left: Math.min(coords1.left, coords2.left),
    right: Math.max(coords1.right, coords2.right),
  };
}

function toRectCoords(node: SceneNode): ICoordinates {
  return {
    top: node.y,
    bottom: node.y + node.height,
    left: node.x,
    right: node.x + node.width,
  };
}

function detectRectCollision(
  rect1: ICoordinates,
  rect2: ICoordinates
): boolean {
  const horizontal = rect2.left <= rect1.right && rect1.left <= rect2.right;
  const vertical = rect2.top <= rect1.bottom && rect1.top <= rect2.bottom;

  return horizontal && vertical;
}
