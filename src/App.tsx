import { type Maybe, Just, Nothing } from "purify-ts";
import { useState, useEffect, useRef } from "react";

import { Connection } from "./components/Connection";
import { Node } from "./components/Node";
import { initialState, update } from "./store/store";
import { getMousePosition } from "./utils/svg";

import type { MapNode, State } from "./store/store";

const renderRects = (
  state: State,
  nodes: ReadonlyArray<MapNode>,
  parent: MapNode
): ReadonlyArray<JSX.Element> | null => {
  if (nodes.length === 0) {
    return null;
  }

  return nodes.flatMap((node) => {
    const n = state.nodes[node.id];
    const p = state.nodes[parent.id];
    const children = renderRects(state, node.nodes, node);
    return [
      ...(children || []),
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
  });
};

function App() {
  const [elId, setElId] = useState<Maybe<string>>(Nothing);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const svg = useRef<SVGSVGElement>(null);
  const [state, setDoc] = useState<State>(initialState);

  const onMove: React.MouseEventHandler<SVGElement> = (e) => {
    if (elId.isJust() && svg.current) {
      e.preventDefault();
      const { x, y } = getMousePosition(svg.current, e);
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
      const { x, y } = getMousePosition(svg.current, e);
      setElId(Just(target.id));
      setDragOffset({
        x: x - Number.parseFloat(target.getAttributeNS(null, "x") || ""),
        y: y - Number.parseFloat(target.getAttributeNS(null, "y") || ""),
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

  const onEndDrag: React.MouseEventHandler<SVGElement> = () => {
    setElId(Nothing);
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
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Demo */}
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
        <title>TODO: Rectangle</title>
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
        {renderRects(state, state.root.nodes, state.root)}
      </svg>
    </div>
  );
}

export { App };
