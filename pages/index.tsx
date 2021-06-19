import { useState, useRef } from "react";

export default function Home() {
  const [el, setEl] = useState<SVGElement | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const svg = useRef<SVGSVGElement>(null);

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
    if (el && svg.current) {
      e.preventDefault();
      const ctm = svg.current.getScreenCTM();
      if (ctm) {
        const { x, y } = getMousePos(e);
        el.setAttributeNS(null, "x", String(x - dragOffset.x));
        el.setAttributeNS(null, "y", String(y - dragOffset.y));
      }
    }
  };

  const onStartDrag: React.MouseEventHandler<SVGElement> = (e) => {
    const target = e.nativeEvent.target as SVGElement;
    if (target.classList.contains("draggable")) {
      setEl(target);
      const { x, y } = getMousePos(e);
      setDragOffset({
        x: x - parseFloat(target.getAttributeNS(null, "x") as string),
        y: y - parseFloat(target.getAttributeNS(null, "y") as string),
      });
    }
  };

  const onEndDrag: React.MouseEventHandler<SVGElement> = (e) => {
    setEl(null);
  };

  return (
    <div className="app">
      <svg
        ref={svg}
        width="100%"
        height="100%"
        viewBox="0 0 1000 1000"
        onMouseDown={onStartDrag}
        onMouseUp={onEndDrag}
        onMouseMove={onMove}
        onMouseLeave={onEndDrag}
      >
        <rect
          className="draggable"
          x="0"
          y="0"
          width="100px"
          height="100px"
          fill="black"
        ></rect>
      </svg>
    </div>
  );
}
