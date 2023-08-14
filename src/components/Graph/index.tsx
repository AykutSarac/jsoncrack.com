import React from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { Space } from "react-zoomable-ui";
import { ElkRoot } from "reaflow/dist/layout/useLayout";
import { EdgeProps } from "reaflow/dist/symbols/Edge";
import { NodeProps } from "reaflow/dist/symbols/Node";
import { useLongPress } from "use-long-press";
import { CustomNode } from "src/components/Graph/CustomNode";
import useToggleHide from "src/hooks/useToggleHide";
import { Loading } from "src/layout/Loading";
import useGraph from "src/store/useGraph";
import useModal from "src/store/useModal";
import useUser from "src/store/useUser";
import { NodeData } from "src/types/models";
import { ErrorView } from "./ErrorView";
import { PremiumView } from "./PremiumView";

const Edge = dynamic(() => import("reaflow").then(r => r.Edge), {
  ssr: false,
});

const Canvas = dynamic(() => import("reaflow").then(r => r.Canvas), {
  ssr: false,
});

interface GraphProps {
  isWidget?: boolean;
}

const StyledEditorWrapper = styled.div<{ $widget: boolean }>`
  position: absolute;
  width: 100%;
  height: ${({ $widget }) => ($widget ? "calc(100vh - 36px)" : "calc(100vh - 63px)")};

  --bg-color: ${({ theme }) => theme.GRID_BG_COLOR};
  --line-color-1: ${({ theme }) => theme.GRID_COLOR_PRIMARY};
  --line-color-2: ${({ theme }) => theme.GRID_COLOR_SECONDARY};

  background-color: var(--bg-color);
  background-image: linear-gradient(var(--line-color-1) 1.5px, transparent 1.5px),
    linear-gradient(90deg, var(--line-color-1) 1.5px, transparent 1.5px),
    linear-gradient(var(--line-color-2) 1px, transparent 1px),
    linear-gradient(90deg, var(--line-color-2) 1px, transparent 1px);
  background-position:
    -1.5px -1.5px,
    -1.5px -1.5px,
    -1px -1px,
    -1px -1px;
  background-size:
    100px 100px,
    100px 100px,
    20px 20px,
    20px 20px;

  :active {
    cursor: move;
  }

  .dragging,
  .dragging button {
    pointer-events: none;
  }

  rect {
    fill: ${({ theme }) => theme.BACKGROUND_NODE};
  }

  @media only screen and (max-width: 768px) {
    height: ${({ $widget }) => ($widget ? "calc(100vh - 36px)" : "100vh")};
  }

  @media only screen and (max-width: 320px) {
    height: 100vh;
  }
`;

const layoutOptions = {
  "elk.layered.compaction.postCompaction.strategy": "EDGE_LENGTH",
  "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
};

const GraphCanvas = ({ isWidget }: { isWidget: boolean }) => {
  const { validateHiddenNodes } = useToggleHide();
  const setLoading = useGraph(state => state.setLoading);
  const centerView = useGraph(state => state.centerView);
  const setSelectedNode = useGraph(state => state.setSelectedNode);
  const setVisible = useModal(state => state.setVisible);
  const direction = useGraph(state => state.direction);
  const nodes = useGraph(state => state.nodes);
  const edges = useGraph(state => state.edges);

  const [paneWidth, setPaneWidth] = React.useState(2000);
  const [paneHeight, setPaneHeight] = React.useState(2000);

  const handleNodeClick = React.useCallback(
    (_: React.MouseEvent<SVGElement>, data: NodeData) => {
      if (setSelectedNode) setSelectedNode(data);
      setVisible("node")(true);
    },
    [setSelectedNode, setVisible]
  );

  const onLayoutChange = React.useCallback(
    (layout: ElkRoot) => {
      if (layout.width && layout.height) {
        const areaSize = layout.width * layout.height;
        const changeRatio = Math.abs((areaSize * 100) / (paneWidth * paneHeight) - 100);

        setPaneWidth(layout.width + 50);
        setPaneHeight((layout.height as number) + 50);

        setTimeout(() => {
          setLoading(false);
          validateHiddenNodes();
          window.requestAnimationFrame(() => {
            if (changeRatio > 70 || isWidget) centerView();
          });
        });
      }
    },
    [centerView, isWidget, paneHeight, paneWidth, setLoading, validateHiddenNodes]
  );

  const onCanvasClick = React.useCallback(() => {
    (document.activeElement as HTMLElement)?.blur();
  }, []);

  const memoizedNode = React.useCallback(
    (props: JSX.IntrinsicAttributes & NodeProps<any>) => (
      // @ts-ignore
      <CustomNode {...props} onClick={handleNodeClick} />
    ),
    [handleNodeClick]
  );

  const memoizedEdge = React.useCallback(
    (props: JSX.IntrinsicAttributes & Partial<EdgeProps>) => (
      <Edge {...props} containerClassName={`edge-${props.id}`} />
    ),
    []
  );

  return (
    <Canvas
      className="jsoncrack-canvas"
      nodes={nodes}
      edges={edges}
      maxHeight={paneHeight}
      maxWidth={paneWidth}
      height={paneHeight}
      width={paneWidth}
      direction={direction}
      layoutOptions={layoutOptions}
      onLayoutChange={onLayoutChange}
      onCanvasClick={onCanvasClick}
      node={memoizedNode}
      edge={memoizedEdge}
      key={direction}
      pannable={false}
      zoomable={false}
      animated={false}
      readonly={true}
      dragEdge={null}
      dragNode={null}
      fit={true}
    />
  );
};

export const Graph = ({ isWidget = false }: GraphProps) => {
  const setViewPort = useGraph(state => state.setViewPort);
  const isPremium = useUser(state => state.premium);
  const viewType = useGraph(state =>
    state.nodes.length > 6_000 ? "error" : state.nodes.length > 250 ? "premium" : "graph"
  );

  const callback = React.useCallback(() => {
    const canvas = document.querySelector(".jsoncrack-canvas") as HTMLDivElement | null;
    canvas?.classList.add("dragging");
  }, []);

  const bindLongPress = useLongPress(callback, {
    threshold: 150,
    onFinish: () => {
      const canvas = document.querySelector(".jsoncrack-canvas") as HTMLDivElement | null;
      canvas?.classList.remove("dragging");
    },
  });

  const blurOnClick = React.useCallback(() => {
    if ("activeElement" in document) (document.activeElement as HTMLElement)?.blur();
  }, []);

  if (viewType === "error") return <ErrorView />;

  if (viewType === "premium" && !isWidget) {
    if (!isPremium) return <PremiumView />;
  }

  return (
    <>
      <Loading message="Painting graph..." />
      <StyledEditorWrapper
        $widget={isWidget}
        onContextMenu={e => e.preventDefault()}
        onClick={blurOnClick}
        {...bindLongPress()}
      >
        <Space
          onCreate={setViewPort}
          onContextMenu={e => e.preventDefault()}
          treatTwoFingerTrackPadGesturesLikeTouch
          pollForElementResizing
        >
          <GraphCanvas isWidget={isWidget} />
        </Space>
      </StyledEditorWrapper>
    </>
  );
};
