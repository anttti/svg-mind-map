import { useState } from "react";
import type { MapNodeInfo } from "../store/store";

type Props = {
  start?: MapNodeInfo;
  end?: MapNodeInfo;
};

export default function Connection({ start, end }: Props) {
  const [isSelected, setIsSelected] = useState(false);

  if (!start || !end) {
    return null;
  }

  const onClick = () => {
    setIsSelected(!isSelected);
  };

  let connStartX = 0;
  let connStartY = 0;
  let connEndX = 0;
  let connEndY = 0;
  let curveX1 = 0;
  let curveY1 = 0;
  let curveX2 = 0;
  let curveY2 = 0;

  const xDist =
    start.position.x > end.position.x
      ? Math.abs(end.position.x - start.position.x + start.size.width)
      : Math.abs(start.position.x - end.position.x + end.size.width);
  const yDist =
    start.position.y > end.position.y
      ? Math.abs(end.position.y - start.position.y + start.size.height)
      : Math.abs(start.position.y - end.position.y + end.size.height);

  if (
    start.position.x + start.size.width * 1.5 < end.position.x ||
    (start.position.x + start.size.width < end.position.x &&
      start.position.y < end.position.y + end.size.height * 1.5)
  ) {
    // Start is to the left of end
    connStartX = start.position.x + start.size.width;
    connEndX = end.position.x;
    connStartY = start.position.y + start.size.height / 2;
    connEndY = end.position.y + end.size.height / 2;
    curveX1 = start.position.x + start.size.width + 0.66 * xDist;
    curveY1 = start.position.y + start.size.height / 2;
    curveX2 = start.position.x + start.size.width + 0.33 * xDist;
    curveY2 = end.position.y + (end.size.height - end.size.height / 2);
  } else if (
    start.position.x > end.position.x + end.size.width * 1.5 ||
    (end.position.x + end.size.width < start.position.x &&
      start.position.y < end.position.y + end.size.height * 1.5)
  ) {
    // Start is to the right of end
    connStartX = start.position.x;
    connEndX = end.position.x + end.size.width;
    connStartY = start.position.y + start.size.height / 2;
    connEndY = end.position.y + end.size.height / 2;
    curveX1 = start.position.x - 0.66 * xDist;
    curveY1 = start.position.y + start.size.height / 2;
    curveX2 = start.position.x - 0.33 * xDist;
    curveY2 = end.position.y + (end.size.height - end.size.height / 2);
  } else {
    // Start is above or below end
    connStartX = start.position.x + start.size.width / 2;
    connEndX = end.position.x + end.size.width / 2;
    curveX1 = start.position.x + start.size.width / 2;
    curveX2 = end.position.x + end.size.width / 2;
    if (start.position.y < end.position.y) {
      // Start is above end
      connStartY = start.position.y + start.size.height;
      connEndY = end.position.y;
      curveY1 = start.position.y + start.size.height + 0.33 * yDist;
      curveY2 = start.position.y + start.size.height + 0.66 * yDist;
    } else {
      // Start is below end
      connStartY = start.position.y;
      connEndY = end.position.y + end.size.height;
      curveY1 = start.position.y - 0.33 * yDist;
      curveY2 = end.position.y + end.size.height + 0.33 * yDist;
    }
  }

  const d = `M ${connStartX} ${connStartY} C ${curveX1} ${curveY1}, ${curveX2} ${curveY2}, ${connEndX} ${connEndY}`;
  return (
    <>
      {isSelected && (
        <>
          <circle cx={curveX1} cy={curveY1} r="5" fill="red" />
          <circle cx={curveX2} cy={curveY2} r="5" />
        </>
      )}
      <path
        d={d}
        stroke="var(--gray-300)"
        strokeWidth="4"
        fill="transparent"
        onClick={onClick}
      />
    </>
  );
}
