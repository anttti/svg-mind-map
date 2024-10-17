import { type Maybe, Nothing } from "purify-ts";

export type ID = string;

export type MapNode = {
  id: ID;
  nodes: ReadonlyArray<MapNode>;
};

export type MapNodeInfo = {
  id: ID;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  color: {
    stroke: string;
    fill: string;
  };
};

export type State = {
  root: MapNode;
  selectedNode: Maybe<string>;
  nodes: {
    [id: string]: MapNodeInfo;
  };
};

const defaultColor = {
  stroke: "var(--blue-200)",
  fill: "var(--blue-50)",
};

export const initialState: State = {
  nodes: {
    "0": {
      id: "0",
      position: {
        x: 50,
        y: 500,
      },
      size: {
        width: 100,
        height: 100,
      },
      color: {
        stroke: "var(--pink-400)",
        fill: "var(--pink-100)",
      },
    },
    "1": {
      id: "1",
      position: {
        x: 250,
        y: 300,
      },
      size: {
        width: 100,
        height: 100,
      },
      color: defaultColor,
    },
    "2": {
      id: "2",
      position: {
        x: 250,
        y: 700,
      },
      size: {
        width: 100,
        height: 100,
      },
      color: defaultColor,
    },
    "3": {
      id: "3",
      position: {
        x: 450,
        y: 100,
      },
      size: {
        width: 100,
        height: 100,
      },
      color: defaultColor,
    },
  },
  root: {
    id: "0",
    nodes: [
      {
        id: "1",
        nodes: [
          {
            id: "3",
            nodes: [],
          },
        ],
      },
      {
        id: "2",
        nodes: [],
      },
    ],
  },
  selectedNode: Nothing,
};

export const update = (
  doc: State,
  maybeId: Maybe<string>,
  changes: Partial<MapNodeInfo>
) => {
  return maybeId.caseOf({
    Nothing: () => doc,
    Just: (id) => {
      const node = doc.nodes[id];
      if (node) {
        return {
          ...doc,
          nodes: {
            ...doc.nodes,
            [id]: { ...node, ...changes },
          },
        };
      }
      return doc;
    },
  });
};
