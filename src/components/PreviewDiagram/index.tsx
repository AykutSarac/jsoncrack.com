import React from "react";
import { ThemeProvider } from "styled-components";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Canvas } from "reaflow";
import { darkTheme } from "src/constants/theme";
import { CustomNode } from "../CustomNode";

const data = {
  nodes: [
    {
      id: "1",
      text: [
        ["squadName", "Super hero squad"],
        ["homeTown", "Metro City"],
        ["formed", 2016],
        ["secretBase", "Super tower"],
        ["active", true],
      ],
      width: 233,
      height: 113,
      data: {
        type: "null",
        isParent: false,
        isEmpty: false,
        childrenCount: 0,
      },
      path: "{Root}",
    },
    {
      id: "2",
      text: "members",
      width: 174,
      height: 39,
      data: {
        type: "array",
        isParent: true,
        isEmpty: false,
        childrenCount: 3,
      },
      path: "{Root}.members",
    },
    {
      id: "3",
      text: [
        ["name", "Molecule Man"],
        ["age", 29],
        ["secretIdentity", "Dan Jukes"],
      ],
      width: 218,
      height: 76,
      data: {
        type: "null",
        isParent: false,
        isEmpty: false,
        childrenCount: 0,
      },
      path: "{Root}.members[0]",
    },
    {
      id: "4",
      text: "powers",
      width: 167,
      height: 39,
      data: {
        type: "array",
        isParent: true,
        isEmpty: false,
        childrenCount: 3,
      },
      path: "{Root}.members[0].powers",
    },
    {
      id: "5",
      text: "Radiation resistance",
      width: 168,
      height: 39,
      data: {
        type: "null",
        isParent: false,
        isEmpty: false,
        childrenCount: 0,
      },
      path: "{Root}.members[0].powers[0]",
    },
    {
      id: "6",
      text: "Turning tiny",
      width: 110,
      height: 39,
      data: {
        type: "null",
        isParent: false,
        isEmpty: false,
        childrenCount: 0,
      },
      path: "{Root}.members[0].powers[1]",
    },
    {
      id: "7",
      text: "Radiation blast",
      width: 132,
      height: 39,
      data: {
        type: "null",
        isParent: false,
        isEmpty: false,
        childrenCount: 0,
      },
      path: "{Root}.members[0].powers[2]",
    },
    {
      id: "8",
      text: [
        ["name", "Madame Uppercut"],
        ["age", 39],
        ["secretIdentity", "Jane Wilson"],
      ],
      width: 233,
      height: 76,
      data: {
        type: "null",
        isParent: false,
        isEmpty: false,
        childrenCount: 0,
      },
      path: "{Root}.members[1]",
    },
    {
      id: "9",
      text: "powers",
      width: 167,
      height: 39,
      data: {
        type: "array",
        isParent: true,
        isEmpty: false,
        childrenCount: 3,
      },
      path: "{Root}.members[1].powers",
    },
    {
      id: "10",
      text: "Million tonne punch",
      width: 161,
      height: 39,
      data: {
        type: "null",
        isParent: false,
        isEmpty: false,
        childrenCount: 0,
      },
      path: "{Root}.members[1].powers[0]",
    },
    {
      id: "11",
      text: "Damage resistance",
      width: 146,
      height: 39,
      data: {
        type: "null",
        isParent: false,
        isEmpty: false,
        childrenCount: 0,
      },
      path: "{Root}.members[1].powers[1]",
    },
    {
      id: "12",
      text: "Superhuman reflexes",
      width: 161,
      height: 39,
      data: {
        type: "null",
        isParent: false,
        isEmpty: false,
        childrenCount: 0,
      },
      path: "{Root}.members[1].powers[2]",
    },
    {
      id: "13",
      text: [
        ["name", "Eternal Flame"],
        ["age", 1000000],
        ["secretIdentity", "Unknown"],
      ],
      width: 204,
      height: 76,
      data: {
        type: "null",
        isParent: false,
        isEmpty: false,
        childrenCount: 0,
      },
      path: "{Root}.members[2]",
    },
    {
      id: "14",
      text: "powers",
      width: 167,
      height: 39,
      data: {
        type: "array",
        isParent: true,
        isEmpty: false,
        childrenCount: 5,
      },
      path: "{Root}.members[2].powers",
    },
    {
      id: "15",
      text: "Immortality",
      width: 103,
      height: 39,
      data: {
        type: "null",
        isParent: false,
        isEmpty: false,
        childrenCount: 0,
      },
      path: "{Root}.members[2].powers[0]",
    },
    {
      id: "16",
      text: "Heat Immunity",
      width: 118,
      height: 39,
      data: {
        type: "null",
        isParent: false,
        isEmpty: false,
        childrenCount: 0,
      },
      path: "{Root}.members[2].powers[1]",
    },
    {
      id: "17",
      text: "Inferno",
      width: 74,
      height: 39,
      data: {
        type: "null",
        isParent: false,
        isEmpty: false,
        childrenCount: 0,
      },
      path: "{Root}.members[2].powers[2]",
    },
    {
      id: "18",
      text: "Teleportation",
      width: 118,
      height: 39,
      data: {
        type: "null",
        isParent: false,
        isEmpty: false,
        childrenCount: 0,
      },
      path: "{Root}.members[2].powers[3]",
    },
    {
      id: "19",
      text: "Interdimensional travel",
      width: 190,
      height: 39,
      data: {
        type: "null",
        isParent: false,
        isEmpty: false,
        childrenCount: 0,
      },
      path: "{Root}.members[2].powers[4]",
    },
  ],
  edges: [
    {
      id: "e1-2",
      from: "1",
      to: "2",
    },
    {
      id: "e2-3",
      from: "2",
      to: "3",
    },
    {
      id: "e3-4",
      from: "3",
      to: "4",
    },
    {
      id: "e4-5",
      from: "4",
      to: "5",
    },
    {
      id: "e4-6",
      from: "4",
      to: "6",
    },
    {
      id: "e4-7",
      from: "4",
      to: "7",
    },
    {
      id: "e2-8",
      from: "2",
      to: "8",
    },
    {
      id: "e8-9",
      from: "8",
      to: "9",
    },
    {
      id: "e9-10",
      from: "9",
      to: "10",
    },
    {
      id: "e9-11",
      from: "9",
      to: "11",
    },
    {
      id: "e9-12",
      from: "9",
      to: "12",
    },
    {
      id: "e2-13",
      from: "2",
      to: "13",
    },
    {
      id: "e13-14",
      from: "13",
      to: "14",
    },
    {
      id: "e14-15",
      from: "14",
      to: "15",
    },
    {
      id: "e14-16",
      from: "14",
      to: "16",
    },
    {
      id: "e14-17",
      from: "14",
      to: "17",
    },
    {
      id: "e14-18",
      from: "14",
      to: "18",
    },
    {
      id: "e14-19",
      from: "14",
      to: "19",
    },
  ],
};

const PreviewDiagram = () => {
  const [paneWidth, setPaneWidth] = React.useState(0);
  const [paneHeight, setPaneHeight] = React.useState(0);

  React.useEffect(() => {
    const container = document.querySelector("#hero-section") as HTMLDivElement;

    if (container) {
      const rects = container.getBoundingClientRect();
      setPaneWidth(rects.width);
      setPaneHeight(rects.height);
    }
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <TransformWrapper
        maxScale={2}
        minScale={0.05}
        initialScale={1}
        wheel={{ step: 0.04 }}
        doubleClick={{ disabled: true }}
        disabled
      >
        <TransformComponent
          wrapperStyle={{
            width: "100%",
            height: "100%",
            overflow: "visible",
          }}
        >
          <Canvas
            nodes={data.nodes}
            edges={data.edges}
            maxHeight={paneHeight}
            maxWidth={paneWidth}
            height={paneHeight}
            width={paneWidth}
            direction="RIGHT"
            node={props => <CustomNode {...props} />}
            pannable={false}
            zoomable={false}
            readonly={true}
            dragEdge={null}
            dragNode={null}
            fit={true}
          />
        </TransformComponent>
      </TransformWrapper>
    </ThemeProvider>
  );
};

export default PreviewDiagram;
