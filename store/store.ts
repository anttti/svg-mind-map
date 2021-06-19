export type ID = string;

export type DocNode = {
  id: ID;
  type: "rect";
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

export type DocState = {
  nodes: ReadonlyArray<DocNode>;
  connections: ReadonlyArray<[ID, ID]>;
};
