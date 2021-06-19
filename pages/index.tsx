import { useState, useRef } from "react";

import Connection from "../components/Connection";
import type { DocNode, DocState } from "../store/store";

const gen = (amount: number): DocState => {
  const d: DocNode[] = [];
  // for (let i = 0; i < amount; i++) {
  // d.push({
  //   id: String(i),
  //   type: "rect",
  //   position: {
  //     x: Math.floor(Math.random() * 500),
  //     y: Math.floor(Math.random() * 500),
  //   },
  //   size: {
  //     width: Math.floor(Math.random() * 100) + 30,
  //     height: Math.floor(Math.random() * 100) + 30,
  //   },
  //   color: "rgb(255 0 0 / 0.5)",
  // });
  // }
  d.push({
    id: "0",
    type: "rect",
    position: {
      x: 10,
      y: 10,
    },
    size: {
      width: 100,
      height: 100,
    },
    color: "rgb(255 0 0 / 0.5)",
  });
  d.push({
    id: "1",
    type: "rect",
    position: {
      x: 200,
      y: 200,
    },
    size: {
      width: 100,
      height: 100,
    },
    color: "rgb(0 0 0 / 0.5)",
  });
  return { nodes: d, connections: [["0", "1"]] };
};

const update = (doc: DocState, id: string, changes: Partial<DocNode>) => {
  const node = doc.nodes.find((n) => n.id === id);
  if (node) {
    return {
      ...doc,
      nodes: [...doc.nodes.filter((n) => n.id !== id), { ...node, ...changes }],
    };
  }
  return doc;
};

export default function Home() {
  const [elId, setElId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const svg = useRef<SVGSVGElement>(null);
  const [doc, setDoc] = useState<DocState>(gen(2));

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
      const ctm = svg.current.getScreenCTM();
      const el = document.getElementById(elId);
      if (ctm && el) {
        const { x, y } = getMousePos(e);
        setDoc(
          update(doc, elId, {
            position: { x: x - dragOffset.x, y: y - dragOffset.y },
          })
        );
      }
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
    }
  };

  const onEndDrag: React.MouseEventHandler<SVGElement> = (e) => {
    setElId(null);
  };

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
      >
        {doc.nodes.map((el) => (
          <rect
            key={el.id}
            id={el.id}
            className="draggable"
            x={el.position.x}
            y={el.position.y}
            width={el.size.width}
            height={el.size.height}
            fill={el.color}
          ></rect>
        ))}
        {doc.connections.map(([start, end]) => (
          <Connection
            key={`${start}${end}`}
            start={doc.nodes.find((n) => n.id === start)}
            end={doc.nodes.find((n) => n.id === end)}
          />
        ))}
      </svg>
    </div>
  );
}
