import React from "react";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import { Canvas, Edge, ElkRoot } from "reaflow";
import { CustomNode } from "src/components/CustomNode";
import useConfig from "src/hooks/store/useConfig";
import useGraph from "src/hooks/store/useGraph";
import styled from "styled-components";
import { Loading } from "../Loading";
import { ErrorView } from "./ErrorView";

interface LayoutProps {
  isWidget?: boolean;
  openModal: () => void;
  setSelectedNode: (node: [string, string][]) => void;
}

const StyledEditorWrapper = styled.div<{ isWidget: boolean }>`
  position: absolute;
  width: 100%;
  height: ${({ isWidget }) => (isWidget ? "100vh" : "calc(100vh - 36px)")};
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};
  background-image: ${({ theme }) =>
    `radial-gradient(#505050 0.5px, ${theme.BACKGROUND_SECONDARY} 0.5px)`};
  background-size: 15px 15px;

  :active {
    cursor: move;
  }

  .dragging {
    pointer-events: none;
  }

  rect {
    fill: ${({ theme }) => theme.BACKGROUND_NODE};
  }
`;

const GraphComponent = ({
  isWidget = false,
  openModal,
  setSelectedNode,
}: LayoutProps) => {
  const [minScale, setMinScale] = React.useState(0.4);
  const setGraphValue = useGraph(state => state.setGraphValue);
  const setLoading = useGraph(state => state.setLoading);
  const setConfig = useConfig(state => state.setConfig);
  const centerView = useConfig(state => state.centerView);
  const loading = useGraph(state => state.loading);
  const layout = useConfig(state => state.layout);
  const nodes = useGraph(state => state.nodes);
  const edges = useGraph(state => state.edges);

  const [size, setSize] = React.useState({
    width: 1,
    height: 1,
  });

  const handleNodeClick = React.useCallback(
    (e: React.MouseEvent<SVGElement>, data: NodeData) => {
      if (setSelectedNode) setSelectedNode(data.text);
      if (openModal) openModal();
    },
    [openModal, setSelectedNode]
  );

  const onInit = React.useCallback(
    (ref: ReactZoomPanPinchRef) => {
      setConfig("zoomPanPinch", ref);
    },
    [setConfig]
  );

  const onLayoutChange = React.useCallback(
    (layout: ElkRoot) => {
      if (layout.width && layout.height) {
        const areaSize = layout.width * layout.height;
        const changeRatio = Math.abs(
          (areaSize * 100) / (size.width * size.height) - 100
        );

        const MIN_SCALE = Math.round((450_000 / areaSize) * 100) / 100;
        const scale = MIN_SCALE > 2 ? 1 : MIN_SCALE <= 0 ? 0.1 : MIN_SCALE;

        setLoading(true);
        setMinScale(scale);
        setSize({ width: layout.width + 400, height: layout.height + 400 });

        requestAnimationFrame(() => {
          setTimeout(() => {
            setLoading(false);
            setTimeout(() => changeRatio > 100 && centerView(), 0);
          }, 0);
        });
      }
    },
    [centerView, setGraphValue, size.height, size.width]
  );

  const onCanvasClick = React.useCallback(() => {
    const input = document.querySelector("input:focus") as HTMLInputElement;
    if (input) input.blur();
  }, []);

  if (nodes.length > 8_000) return <ErrorView />;

  return (
    <StyledEditorWrapper isWidget={isWidget}>
      {loading && <Loading message="Painting graph..." />}
      <TransformWrapper
        maxScale={2}
        minScale={minScale}
        initialScale={0.4}
        wheel={{ step: 0.08 }}
        zoomAnimation={{ animationType: "linear" }}
        doubleClick={{ disabled: true }}
        onInit={onInit}
        onPanning={ref => ref.instance.wrapperComponent?.classList.add("dragging")}
        onPanningStop={ref =>
          ref.instance.wrapperComponent?.classList.remove("dragging")
        }
      >
        <TransformComponent
          wrapperStyle={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            display: loading ? "none" : "block",
          }}
        >
          <Canvas
            className="jsoncrack-canvas"
            nodes={nodes}
            edges={edges}
            maxWidth={size.width}
            maxHeight={size.height}
            direction={layout}
            onLayoutChange={onLayoutChange}
            onCanvasClick={onCanvasClick}
            key={layout}
            zoomable={false}
            animated={false}
            readonly={true}
            dragEdge={null}
            dragNode={null}
            fit={true}
            node={props => <CustomNode {...props} onClick={handleNodeClick} />}
            edge={props => (
              <Edge {...props} containerClassName={`edge-${props.id}`} />
            )}
          />
        </TransformComponent>
      </TransformWrapper>
    </StyledEditorWrapper>
  );
};

export const Graph = React.memo(GraphComponent);
