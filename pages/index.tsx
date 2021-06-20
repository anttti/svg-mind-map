import { Just, Nothing } from "purify-ts";
import { useState, useRef } from "react";

import Connection from "../components/Connection";
import Node from "../components/Node";
import type { MapNode, State } from "../store/store";
import { initialState, update } from "../store/store";

export default function Home() {
  const [elId, setElId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const svg = useRef<SVGSVGElement>(null);
  const [state, setDoc] = useState<State>(initialState);

  const getMousePos = (e: { clientX: number; clientY: number }) => {
    if (svg.current) {
      const ctm = svg.current.getScreenCTM();
      if (ctm) {
        const x = (e.clientX - ctm.e) / ctm.a;
        const y = (e.clientY - ctm.f) / ctm.d;
        return { x, y };
      }
    }
    return { x: 0, y: 0 };
  };

  const onMove: React.MouseEventHandler<SVGElement> = (e) => {
    if (elId && svg.current) {
      e.preventDefault();
      const { x, y } = getMousePos(e);
      setDoc(
        update(state, elId, {
          position: { x: x - dragOffset.x, y: y - dragOffset.y },
        })
      );
    }
  };

  const onStartDrag: React.MouseEventHandler<SVGElement> = (e) => {
    const target = e.nativeEvent.target as SVGElement;
    if (target.classList.contains("draggable")) {
      setElId(target.id);
      const { x, y } = getMousePos(e);
      setDragOffset({
        x: x - parseFloat(target.getAttributeNS(null, "x") as string),
        y: y - parseFloat(target.getAttributeNS(null, "y") as string),
      });
      setDoc({
        ...state,
        selectedNode: Just(target.id),
      });
    }
  };

  const onClick: React.MouseEventHandler<SVGElement> = (e) => {
    const target = e.nativeEvent.target as SVGElement;
    if (target.classList.contains("draggable")) {
      setDoc({
        ...state,
        selectedNode: Just(target.id),
      });
    } else {
      setDoc({
        ...state,
        selectedNode: Nothing,
      });
    }
  };

  const onEndDrag: React.MouseEventHandler<SVGElement> = (e) => {
    setElId(null);
  };

  const renderRects = (
    nodes: ReadonlyArray<MapNode>,
    parent: MapNode
  ): ReadonlyArray<JSX.Element> | null => {
    if (nodes.length === 0) {
      return null;
    }

    return nodes
      .map((node) => {
        const n = state.nodes[node.id];
        const p = state.nodes[parent.id];
        const children = renderRects(node.nodes, node);
        return [
          ...(children ? children : []),
          <Connection key={`${parent.id}${n.id}`} start={p} end={n} />,
          <Node
            key={n.id}
            id={n.id}
            isSelected={state.selectedNode.equals(Just(n.id))}
            stroke={n.color.stroke}
            fill={n.color.fill}
            x={n.position.x}
            y={n.position.y}
            w={n.size.width}
            h={n.size.height}
          />,
        ];
      })
      .flat();
  };

  const rootNode = state.nodes[state.root.id];

  return (
    <div className="app">
      <svg
        ref={svg}
        viewBox="0 0 1000 1000"
        width="100%"
        height="100%"
        onMouseDown={onStartDrag}
        onMouseUp={onEndDrag}
        onMouseMove={onMove}
        onMouseLeave={onEndDrag}
        onClick={onClick}
      >
        <Node
          id={rootNode.id}
          isSelected={state.selectedNode.equals(Just(rootNode.id))}
          stroke={rootNode.color.stroke}
          fill={rootNode.color.fill}
          x={rootNode.position.x}
          y={rootNode.position.y}
          w={rootNode.size.width}
          h={rootNode.size.height}
        />
        {renderRects(state.root.nodes, state.root)}
      </svg>
    </div>
  );
}
