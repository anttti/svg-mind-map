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
  color: string;
};

export type State = {
  root: MapNode;
  nodes: {
    [id: string]: MapNodeInfo;
  };
};
