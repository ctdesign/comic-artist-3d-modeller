export const ELEMENT_TYPES = {
  PERSON: 'person',
  CHAIR: 'chair',
  BED: 'bed',
  TREE: 'tree',
  SPHERE: 'sphere',
  CUBE: 'cube',
  PYRAMID: 'pyramid',
  WALL: 'wall',
};

export const ELEMENT_DEFAULTS = {
  [ELEMENT_TYPES.PERSON]: {
    name: 'Person',
    defaultSize: { width: 0.5, height: 1.8, depth: 0.3 },
    icon: '🧍',
  },
  [ELEMENT_TYPES.CHAIR]: {
    name: 'Chair',
    defaultSize: { width: 0.5, height: 0.9, depth: 0.5 },
    icon: '🪑',
  },
  [ELEMENT_TYPES.BED]: {
    name: 'Bed',
    defaultSize: { width: 1.5, height: 0.5, depth: 2 },
    icon: '🛏️',
  },
  [ELEMENT_TYPES.SPHERE]: {
    name: 'Sphere',
    defaultSize: { width: 1, height: 1, depth: 1 },
    icon: '⚪',
  },
  [ELEMENT_TYPES.CUBE]: {
    name: 'Cube',
    defaultSize: { width: 1, height: 1, depth: 1 },
    icon: '🟦',
  },
  [ELEMENT_TYPES.PYRAMID]: {
    name: 'Pyramid',
    defaultSize: { width: 1, height: 1, depth: 1 },
    icon: '🔺',
  },
  [ELEMENT_TYPES.TREE]: {
    name: 'Tree',
    defaultSize: { width: 1, height: 3, depth: 1 },
    icon: '🌲',
  },
  [ELEMENT_TYPES.WALL]: {
    name: 'Wall',
    defaultSize: { width: 0.2, height: 2.5, depth: 1 },
    icon: '🧱',
  },
};
