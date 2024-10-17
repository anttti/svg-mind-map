import { useState } from "react";
import type { MapNodeInfo } from "../store/store";

type Props = {
  start?: MapNodeInfo;
  end?: MapNodeInfo;
};

function Connection({ start, end }: Props) {
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
  const startX = start.position.x;
  const startY = start.position.y;
  const startWidth = start.size.width;
  const startHeight = start.size.height;
  const endX = end.position.x;
  const endY = end.position.y;
  const endWidth = end.size.width;
  const endHeight = end.size.height;

  const xDist =
    startX > endX
      ? Math.abs(endX - startX + startWidth)
      : Math.abs(startX - endX + endWidth);
  const yDist =
    startY > endY
      ? Math.abs(endY - startY + startHeight)
      : Math.abs(startY - endY + endHeight);

  if (
    startX + startWidth * 1.5 < endX ||
    (startX + startWidth < endX && startY < endY + endHeight * 1.5)
  ) {
    // Start is to the left of end
    connStartX = startX + startWidth;
    connEndX = endX;
    connStartY = startY + startHeight / 2;
    connEndY = endY + endHeight / 2;
    curveX1 = startX + startWidth + 0.66 * xDist;
    curveY1 = startY + startHeight / 2;
    curveX2 = startX + startWidth + 0.33 * xDist;
    curveY2 = endY + (endHeight - endHeight / 2);
  } else if (
    startX > endX + endWidth * 1.5 ||
    (endX + endWidth < startX && startY < endY + endHeight * 1.5)
  ) {
    // Start is to the right of end
    connStartX = startX;
    connEndX = endX + endWidth;
    connStartY = startY + startHeight / 2;
    connEndY = endY + endHeight / 2;
    curveX1 = startX - 0.66 * xDist;
    curveY1 = startY + startHeight / 2;
    curveX2 = startX - 0.33 * xDist;
    curveY2 = endY + (endHeight - endHeight / 2);
  } else {
    // Start is above or below end
    connStartX = startX + startWidth / 2;
    connEndX = endX + endWidth / 2;
    curveX1 = startX + startWidth / 2;
    curveX2 = endX + endWidth / 2;
    if (startY < endY) {
      // Start is above end
      connStartY = startY + startHeight;
      connEndY = endY;
      curveY1 = startY + startHeight + 0.33 * yDist;
      curveY2 = startY + startHeight + 0.66 * yDist;
    } else {
      // Start is below end
      connStartY = startY;
      connEndY = endY + endHeight;
      curveY1 = startY - 0.33 * yDist;
      curveY2 = endY + endHeight + 0.33 * yDist;
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
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Demo only */}
      <path
        d={d}
        stroke="var(--blue-200)"
        strokeWidth="4"
        fill="transparent"
        onClick={onClick}
      />
    </>
  );
}

export { Connection };
