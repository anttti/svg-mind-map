import type { DocNode } from "../store/store";

type Props = {
  start?: DocNode;
  end?: DocNode;
};

export default function Connection({ start, end }: Props) {
  if (!start || !end) {
    return null;
  }

  let connStartX = 0;
  let connStartY = 0;
  let connEndX = 0;
  let connEndY = 0;

  if (start.position.x + start.size.width < end.position.x) {
    // Start is to the left of end
    connStartX = start.position.x + start.size.width;
    connEndX = end.position.x;

    connStartY = start.position.y + start.size.height / 2;
    connEndY = end.position.y + end.size.height / 2;
  } else if (start.position.x > end.position.x + end.size.width) {
    // Start is to the right of end
    connStartX = start.position.x;
    connEndX = end.position.x + end.size.width;

    connStartY = start.position.y + start.size.height / 2;
    connEndY = end.position.y + end.size.height / 2;
  } else {
    // Start is above or below end
    connStartX = start.position.x + start.size.width / 2;
    connEndX = end.position.x + end.size.width / 2;

    if (start.position.y < end.position.y) {
      connStartY = start.position.y + start.size.height;
      connEndY = end.position.y;
    } else {
      connStartY = start.position.y;
      connEndY = end.position.y + end.size.height;
    }
  }

  const d = `M ${connStartX} ${connStartY} L ${connEndX} ${connEndY}`;
  return <path d={d} stroke="black" />;
}
