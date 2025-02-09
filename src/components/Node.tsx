const selectedPadding = 4;

const Node = ({
  id,
  stroke,
  fill,
  x,
  y,
  w,
  h,
  isSelected,
}: {
  id: string;
  stroke: string;
  fill: string;
  x: number;
  y: number;
  w: number;
  h: number;
  isSelected: boolean;
}) => (
  <>
    {isSelected && (
      <rect
        id={id}
        x={x - selectedPadding}
        y={y - selectedPadding}
        width={w + selectedPadding * 2}
        height={h + selectedPadding * 2}
        fill="transparent"
        stroke="var(--blue-200)"
        strokeWidth="8"
        rx="16"
      />
    )}

    <rect
      id={id}
      className="draggable"
      x={x}
      y={y}
      width={w}
      height={h}
      fill={fill}
      stroke={stroke}
      strokeWidth="4"
      rx="12"
    />
  </>
);

export { Node };
