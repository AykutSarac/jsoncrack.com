import React from "react";
import styled from "styled-components";
import { JSONGraph } from "jsongraph-react";
import useGraph from "src/store/useGraph";
import useJC from "src/store/useJC";
import useJson from "src/store/useJson";
import useModal from "src/store/useModal";
import useStored from "src/store/useStored";
import { NodeData } from "src/types/graph";

const StyledLiveEditor = styled.div`
  position: relative;
  height: 100%;
`;

const LiveEditor: React.FC = () => {
  const lightmode = useStored(state => state.lightmode);
  const json = useJson(state => state.json);
  const setJCRef = useJC(state => state.setJCRef);
  const graphRef = useJC(state => state.graphRef);
  const setSelectedNode = useGraph(state => state.setSelectedNode);
  const setVisible = useModal(state => state.setVisible);

  console.log(graphRef);

  const handleNodeClick = React.useCallback(
    (data: NodeData) => {
      if (setSelectedNode) setSelectedNode(data);
      setVisible("node")(true);
    },
    [setSelectedNode, setVisible]
  );

  const style = React.useMemo(
    () => ({
      width: "100%",
      height: "100%",
    }),
    []
  );

  const handleLayoutChange = React.useCallback(() => {
    // graphRef shouldn't be null here
    console.log(graphRef);
    setTimeout(graphRef?.centerView, 100);
  }, [graphRef]);

  const layout = React.useMemo(
    () => ({
      touchGestures: true,
      theme: lightmode ? "light" : ("dark" as any),
    }),
    [lightmode]
  );

  return (
    <StyledLiveEditor>
      <JSONGraph
        ref={setJCRef}
        json={json}
        style={style}
        onNodeClick={handleNodeClick}
        onLayoutChange={handleLayoutChange}
        layout={layout}
      />
    </StyledLiveEditor>
  );
};
export default LiveEditor;
// import React from "react";
// import styled from "styled-components";
// import { Graph } from "src/components/Graph";

// const StyledLiveEditor = styled.div`
//   position: relative;
//   height: 100%;
// `;

// const LiveEditor: React.FC = () => {
//   return (
//     <StyledLiveEditor>
//       <Graph />
//     </StyledLiveEditor>
//   );
// };

// export default LiveEditor;
