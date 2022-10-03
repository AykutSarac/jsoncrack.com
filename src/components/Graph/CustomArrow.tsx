import { Arrow, MarkerArrowProps } from "reaflow";

type CustomArrowProps = Partial<
  MarkerArrowProps & {
    layout: string;
  }
>;

export default function CustomArrow(props: CustomArrowProps) {
  const size = props.size ? props.size : 8;
  var angle: string;
  switch (props.layout) {
    case "UP":
      angle = "270";
      break;
    case "LEFT":
      angle = "180";
      break;
    case "DOWN":
      angle = "90";
      break;
    case "RIGHT":
    default:
      angle = "0";
      break;
  }

  return (
    <marker
      id="end-arrow"
      key="end-arrow"
      viewBox={`0 -${size / 2} ${size} ${size}`}
      refX={`${size}`}
      markerWidth={`${size}`}
      markerHeight={`${size}`}
      orient={angle}
    >
      <Arrow size={size} style={props.style} className={props.className} />
    </marker>
  );
}
