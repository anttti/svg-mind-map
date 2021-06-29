import { Maybe, Just, Nothing } from "purify-ts";
import { useState, useEffect, useRef } from "react";

import Connection from "../components/Connection";
import Node from "../components/Node";
import type { MapNode, State } from "../store/store";
import { initialState, update } from "../store/store";

export default function Home() {
  const [elId, setElId] = useState<Maybe<string>>(Nothing);
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
    if (elId.isJust() && svg.current) {
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
      const { x, y } = getMousePos(e);
      setElId(Just(target.id));
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
    setDoc({
      ...state,
      selectedNode: target.classList.contains("draggable")
        ? Just(target.id)
        : Nothing,
    });
  };

  const onEndDrag: React.MouseEventHandler<SVGElement> = (e) => {
    setElId(Nothing);
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

  const { selectedNode } = state;
  useEffect(() => {
    const onKeyPress = (e: globalThis.KeyboardEvent) => {
      if (selectedNode.isNothing()) {
        return;
      }

      if (e.code === "Space") {
        // Create a sibling
        // TODO: Figure out how to map tab
        console.log("new sibling");
      } else if (e.code === "Enter") {
        // Create a child
        console.log("new child");
      }
    };
    // Attach keyboard listener once
    window.addEventListener("keypress", onKeyPress);
    return () => {
      window.removeEventListener("keypress", onKeyPress);
    };
  }, [selectedNode]);

  return (
    <div className="app">
      <pre className="debug">
        <code>{JSON.stringify(state, null, 2)}</code>
      </pre>
      <svg
        className="canvas"
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
