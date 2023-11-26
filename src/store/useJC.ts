import { GraphRef } from "jsongraph-react";
import { create } from "zustand";

interface JCActions {
  setJCRef: (graphRef: GraphRef) => void;
}

const initialStates = {
  graphRef: null as unknown as GraphRef,
};

export type JCStates = typeof initialStates;

const useJC = create<JCStates & JCActions>()(set => ({
  ...initialStates,
  setJCRef: graphRef => set({ graphRef }),
}));

export default useJC;
