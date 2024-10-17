const getMousePosition = (
  svg: SVGSVGElement | null,
  e: { clientX: number; clientY: number }
) => {
  if (svg) {
    const ctm = svg.getScreenCTM();
    if (ctm) {
      const x = (e.clientX - ctm.e) / ctm.a;
      const y = (e.clientY - ctm.f) / ctm.d;
      return { x, y };
    }
  }
  return { x: 0, y: 0 };
};

export { getMousePosition };
