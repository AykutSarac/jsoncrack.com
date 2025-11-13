# Inline Node Editing - JSX Implementation

## Overview

When `isEditing` is true for a node, the node content is replaced with an inline editor featuring:
- Text input field for the value
- Save button (✓) - saves changes
- Cancel button (✕) - discards changes
- Keyboard shortcuts (Enter to save, Escape to cancel)
- Auto-focus and select on open

## Files Created

### 1. `src/features/editor/views/GraphView/CustomNode/TextEditComponent.tsx`

Component for editing simple text/primitive values.

```tsx
export interface TextEditProps {
  node: NodeData;
}

export const TextEditComponent = ({ node }: TextEditProps) => {
  // Stores temporary value in state
  const [tempValue, setTempValue] = React.useState(
    JSON.stringify(node.text[0].value)
  );

  const handleSave = () => {
    // Calls updateNodeValue() from useJson store
    updateNodeValue(node.path, tempValue);
    stopEdit();
  };

  const handleCancel = () => {
    // Cancels without saving
    stopEdit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  return (
    <StyledEditWrapper>
      <StyledEditInput
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter value"
      />
      <StyledEditButton2 onClick={handleSave}>✓</StyledEditButton2>
      <StyledEditButton2 onClick={handleCancel}>✕</StyledEditButton2>
    </StyledEditWrapper>
  );
};
```

**Features:**
- Stores original value from `node.text[0].value`
- Input auto-focuses and selects on mount
- Keyboard support (Enter/Escape)
- Click handlers prevent propagation
- Calls `updateNodeValue()` on save
- Graph re-renders automatically after save

### 2. `src/features/editor/views/GraphView/CustomNode/RowEditComponent.tsx`

Component for editing individual rows in object nodes.

```tsx
export interface RowEditProps {
  row: NodeData["text"][number];
  nodePath: NodeData["path"];
}

export const RowEditComponent = ({ row, nodePath }: RowEditProps) => {
  // Stores temporary value
  const [tempValue, setTempValue] = React.useState(JSON.stringify(row.value));

  const handleSave = () => {
    updateNodeValue(nodePath, tempValue);
    stopEdit();
  };

  const handleCancel = () => {
    stopEdit();
  };

  return (
    <StyledEditWrapper>
      {row.key && <StyledKey>{row.key}:</StyledKey>}
      <StyledEditInput
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <StyledEditButton2 onClick={handleSave}>✓</StyledEditButton2>
      <StyledEditButton2 onClick={handleCancel}>✕</StyledEditButton2>
    </StyledEditWrapper>
  );
};
```

**Features:**
- Shows row key if present (e.g., "name:")
- Editable input for the value
- Same keyboard shortcuts as TextEdit
- Maintains consistent styling with node

## Files Modified

### 3. `src/features/editor/views/GraphView/CustomNode/TextNode.tsx`

Changed the render logic to show edit component when editing:

```tsx
const Node = ({ node, x, y }: CustomNodeProps) => {
  const isEditing = editingNodeId === node.id;

  return (
    <Styled.StyledForeignObject>
      {isImage ? (
        <StyledImageWrapper>...</StyledImageWrapper>
      ) : isEditing ? (
        // Show editor when isEditing = true
        <TextEditComponent node={node} />
      ) : (
        // Show normal view when not editing
        <StyledTextNodeWrapper>
          <TextRenderer>{value}</TextRenderer>
        </StyledTextNodeWrapper>
      )}
    </Styled.StyledForeignObject>
  );
};
```

### 4. `src/features/editor/views/GraphView/CustomNode/ObjectNode.tsx`

Updated Row component to support editing:

```tsx
const Row = ({ 
  row, 
  x, 
  y, 
  index, 
  nodeId,      // NEW
  nodePath,    // NEW
  isEditing    // NEW
}: RowProps) => {
  const isRowEditing = isEditing && editingNodeId === nodeId;

  return (
    <Styled.StyledRow>
      {isRowEditing ? (
        // Show editor for this row
        <RowEditComponent row={row} nodePath={nodePath} />
      ) : (
        // Show normal row
        <>
          <Styled.StyledKey>{row.key}: </Styled.StyledKey>
          <TextRenderer>{getRowText()}</TextRenderer>
        </>
      )}
    </Styled.StyledRow>
  );
};
```

Updated Node component to pass new props:

```tsx
{node.text.map((row, index) => (
  <Row
    key={`${node.id}-${index}`}
    row={row}
    x={x}
    y={y}
    index={index}
    nodeId={node.id}        // NEW
    nodePath={node.path}    // NEW
    isEditing={isEditing}   // NEW
  />
))}
```

### 5. `src/features/editor/views/GraphView/CustomNode/styles.tsx`

Added new styled components for inline editing:

```tsx
export const StyledEditWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  height: 100%;
  padding: 0 8px;
  box-sizing: border-box;
`;

export const StyledEditInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 20px;
  padding: 2px 4px;
  border: 1px solid ${({ theme }) => theme.INTERACTIVE_ACTIVE};
  background: ${({ theme }) => theme.BACKGROUND_NODE};
  color: ${({ theme }) => theme.NODE_COLORS.TEXT};
  font-family: monospace;
  font-size: 11px;

  &:focus {
    border-color: ${({ theme }) => theme.INTERACTIVE_ACTIVE};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
  }
`;

export const StyledEditButton2 = styled.button`
  padding: 2px 6px;
  height: 20px;
  border: 1px solid ${({ theme }) => theme.INTERACTIVE_NORMAL};
  background: ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  font-size: 10px;
  font-weight: 600;
  border-radius: 2px;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.1s ease;

  &:hover {
    background: ${({ theme }) => theme.INTERACTIVE_ACTIVE};
    color: ${({ theme }) => theme.BACKGROUND_NODE};
  }
`;
```

## Visual Layout

### Text Node Edit Mode

```
┌──────────────────────────────┐
│ [Input field] [✓] [✕]       │
└──────────────────────────────┘
  └─ Auto-focused
  └─ Text selected
  └─ Type to edit
  └─ Enter/Esc to save/cancel
```

### Object Node Edit Mode

```
┌──────────────────────────────────┐
│ key: [Input field] [✓] [✕]      │
└──────────────────────────────────┘
  └─ Shows key name
  └─ Editable value
  └─ Save/Cancel buttons
```

## Data Flow

```
User clicks edit button on node
         ↓
toggleEdit(nodeId) in useNodeEdit
         ↓
isEditing = true
         ↓
Component conditionally renders TextEditComponent
         ↓
Input auto-focuses
         ↓
User types new value in state
         ↓
User presses Enter or clicks Save
         ↓
handleSave() called
         ↓
updateNodeValue(path, tempValue) from useJson
         ↓
JSON updated in store
         ↓
useGraph.setGraph() called automatically
         ↓
Graph re-parsed and visualization updates
         ↓
stopEdit() clears editing state
         ↓
Component re-renders without editor
         ↓
Shows new value in normal view
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Enter** | Save and close editor |
| **Escape** | Cancel and close editor |
| **Tab** | Not captured (browser default) |

## Features

✅ **Auto-focus** - Input focuses immediately when editor opens  
✅ **Auto-select** - Current value is selected for easy replacement  
✅ **Type-smart** - Value automatically converted to appropriate type  
✅ **Event isolation** - Clicks/keys don't propagate to graph  
✅ **Theme-aware** - Uses theme colors for dark/light mode  
✅ **Immediate feedback** - Graph updates instantly on save  
✅ **Cancel support** - Escape key discards changes  
✅ **Visual feedback** - Styled buttons with hover effects  

## Integration Points

### useJson Store
```typescript
const { updateNodeValue } = useJson();
updateNodeValue(node.path, tempValue);
```
Automatically updates JSON and re-renders graph

### useNodeEdit Store
```typescript
const { editingNodeId, stopEdit } = useNodeEdit();
```
Manages which node is in edit mode

## Implementation Details

### TextEditComponent

1. **Mount Phase**:
   - Store current value in state
   - Focus input
   - Select all text

2. **Edit Phase**:
   - User types in input
   - tempValue state updates
   - No graph changes yet

3. **Save Phase**:
   - Click ✓ or press Enter
   - Call `updateNodeValue(node.path, tempValue)`
   - Graph updates automatically
   - Call `stopEdit()`
   - Component re-renders to normal view

4. **Cancel Phase**:
   - Click ✕ or press Escape
   - Discard tempValue
   - Call `stopEdit()`
   - Component re-renders to normal view

### RowEditComponent

Same flow as TextEditComponent, but:
- Receives `nodePath` (parent path) instead of full node
- Shows row key if present
- Passes same `nodePath` to `updateNodeValue`

## Styling Details

```
Input Field:
  - Monospace font (matches node content)
  - 11px font size
  - Blue border on focus
  - Same theme colors as node

Buttons:
  - 20px height (matches row height)
  - 10px font size
  - Compact padding (2px 6px)
  - Hover effect changes colors
  - Checkmark (✓) for save
  - X mark (✕) for cancel
  - Flex-shrink: 0 (fixed size)
```

## Error Handling

1. **Invalid JSON**: Automatically handled by `parseValueInput()`
   - Defaults to string if parsing fails

2. **Type Conversion**: Smart automatic conversion
   - `"123"` → `123` (number)
   - `"true"` → `true` (boolean)
   - `"null"` → `null`
   - etc.

3. **Empty input**: Treated as string `""`

## Performance Considerations

- **Memoization**: Components properly memoized to prevent unnecessary re-renders
- **Event delegation**: Uses `stopPropagation()` to isolate edit mode from graph interactions
- **Ref focus**: Direct ref access for efficient focus/select
- **Callbacks**: useCallback for optimized event handlers

## Testing Checklist

- [ ] Click edit button → Input shows with current value
- [ ] Input auto-focuses and selects text
- [ ] Type new value → State updates
- [ ] Press Enter → Saves and closes editor
- [ ] Press Escape → Cancels without saving
- [ ] Click ✓ → Saves and closes
- [ ] Click ✕ → Cancels and closes
- [ ] Graph updates after save
- [ ] New value visible in normal view
- [ ] Works for both text and object nodes
