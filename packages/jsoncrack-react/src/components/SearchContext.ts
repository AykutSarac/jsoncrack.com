import { createContext, useContext } from "react";

export interface SearchContextValue {
  isSearchActive: boolean;
  isNodeMatched: (nodeId: string) => boolean;
  matchedNodeIds: Set<string>;
  isRowMatched?: (nodeId: string, rowIndex: number) => boolean;
  selectedRowIndex?: number;
}

const EMPTY: SearchContextValue = {
  isSearchActive: false,
  isNodeMatched: () => false,
  matchedNodeIds: new Set(),
};

export const SearchContext = createContext<SearchContextValue>(EMPTY);

export const useSearchContext = (): SearchContextValue => useContext(SearchContext);
