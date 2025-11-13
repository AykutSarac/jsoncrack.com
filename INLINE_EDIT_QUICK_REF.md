# Inline Edit - Quick Reference

## Files Created/Modified

```
✅ Created: TextEditComponent.tsx (60 lines)
✅ Created: RowEditComponent.tsx (65 lines)
✅ Modified: TextNode.tsx (conditional render)
✅ Modified: ObjectNode.tsx (Row support + props)
✅ Modified: styles.tsx (3 new styled components)
```

## JSX: TextEditComponent (Simple Values)

```tsx
return (
  <Styled.StyledEditWrapper>
    <Styled.StyledEditInput
      ref={inputRef}
      value={tempValue}
      onChange={(e) => setTempValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Enter value"
    />
    <Styled.StyledEditButton2 onClick={handleSave}>✓</Styled.StyledEditButton2>
    <Styled.StyledEditButton2 onClick={handleCancel}>✕</Styled.StyledEditButton2>
  </Styled.StyledEditWrapper>
);
```

## JSX: RowEditComponent (Object Rows)

```tsx
return (
  <Styled.StyledEditWrapper>
    {row.key && <Styled.StyledKey>{row.key}:</Styled.StyledKey>}
    <Styled.StyledEditInput
      ref={inputRef}
      value={tempValue}
      onChange={(e) => setTempValue(e.target.value)}
      onKeyDown={handleKeyDown}
      style={{ flex: 1 }}
    />
    <Styled.StyledEditButton2 onClick={handleSave}>✓</Styled.StyledEditButton2>
    <Styled.StyledEditButton2 onClick={handleCancel}>✕</Styled.StyledEditButton2>
  </Styled.StyledEditWrapper>
);
```

## JSX: Conditional Rendering in TextNode

```tsx
{isImage ? (
  <StyledImageWrapper>...</StyledImageWrapper>
) : isEditing ? (
  <TextEditComponent node={node} />    // ← Editor
) : (
  <StyledTextNodeWrapper>              // ← Normal
    <TextRenderer>{value}</TextRenderer>
  </StyledTextNodeWrapper>
)}
```

## JSX: Conditional Rendering in ObjectNode (Row)

```tsx
{isRowEditing ? (
  <RowEditComponent row={row} nodePath={nodePath} />  // ← Editor
) : (
  <>
    <Styled.StyledKey>{row.key}: </Styled.StyledKey>  // ← Normal
    <TextRenderer>{getRowText()}</TextRenderer>
  </>
)}
```

## Key Event Handlers

```tsx
const handleKeyDown = (e: React.KeyboardEvent) => {
  e.stopPropagation();
  if (e.key === "Enter") handleSave(e);
  if (e.key === "Escape") handleCancel(e);
};

const handleSave = (e: React.MouseEvent) => {
  e.stopPropagation();
  updateNodeValue(path, tempValue);
  stopEdit();
};

const handleCancel = (e: React.MouseEvent) => {
  e.stopPropagation();
  stopEdit();
};
```

## Auto-Focus Logic

```tsx
React.useEffect(() => {
  inputRef.current?.focus();
  inputRef.current?.select();
}, []);
```

## Styled Components

```tsx
StyledEditWrapper        // Flex container for editor
StyledEditInput         // Text input field
StyledEditButton2       // Save/Cancel buttons
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Enter | Save |
| Escape | Cancel |
| Tab | Browser default |

## State Management

```
useJson.updateNodeValue(path, value)
  ↓
  Updates JSON
  Re-parses graph
  Updates visualization

useNodeEdit.stopEdit()
  ↓
  Clears editingNodeId
  Component re-renders
  Shows normal view
```

## Component Props

### TextEditComponent
```tsx
interface TextEditProps {
  node: NodeData;
}
```

### RowEditComponent
```tsx
interface RowEditProps {
  row: NodeData["text"][number];
  nodePath: NodeData["path"];
}
```

### Row (in ObjectNode)
```tsx
type RowProps = {
  row: NodeData["text"][number];
  x: number;
  y: number;
  index: number;
  nodeId: string;           // NEW
  nodePath: NodeData["path"]; // NEW
  isEditing: boolean;       // NEW
};
```

## Usage Flow

1. User clicks ✎ button
2. `toggleEdit(nodeId)` updates store
3. `isEditing = true`
4. Conditional render shows editor
5. Input auto-focuses
6. User types value
7. User presses Enter or clicks ✓
8. `handleSave()` → `updateNodeValue()` → JSON updates → Graph re-renders
9. `stopEdit()` clears state
10. Component re-renders normal view

## Type Conversion

```
Input → Converted Value
"123" → 123 (number)
"true" → true (boolean)
"false" → false (boolean)
"null" → null
"[1,2]" → [1,2] (array)
'{"x":1}' → {x:1} (object)
"hello" → "hello" (string)
```

## All Event Handlers Use stopPropagation()

```tsx
e.stopPropagation()  // Prevent reaching graph
```

Prevents:
- Node click handler from firing
- Graph pan/zoom from activating
- Keyboard shortcuts from conflicting

## Visual States

| State | Show |
|-------|------|
| isEditing = false | Normal text/rows |
| isEditing = true | TextEditComponent |
| isRowEditing = true | RowEditComponent |

## Files Quick Summary

| File | Lines | Role |
|------|-------|------|
| TextEditComponent.tsx | 65 | Edit primitive values |
| RowEditComponent.tsx | 70 | Edit object rows |
| TextNode.tsx | Modified | Use conditional render |
| ObjectNode.tsx | Modified | Support row editing |
| styles.tsx | +45 | Styling components |

## Integration Points

```
TextEditComponent
  ├─ useNodeEdit (get editingNodeId, stopEdit)
  ├─ useJson (get updateNodeValue)
  └─ Refs (focus/select input)

RowEditComponent
  ├─ useNodeEdit (stopEdit)
  ├─ useJson (updateNodeValue)
  └─ Refs (focus/select input)

TextNode
  ├─ Conditional render on isEditing
  └─ Shows editor when true

ObjectNode
  ├─ Row component with new props
  └─ Conditional render per row
```

## No Breaking Changes

✅ Existing functionality preserved  
✅ No API changes to other components  
✅ Non-destructive edits (can cancel)  
✅ Automatic graph updates  
✅ Type-safe implementation  

## Testing Checklist

- [ ] Click ✎ → Editor appears
- [ ] Input auto-focuses
- [ ] Text auto-selects
- [ ] Type new value
- [ ] Press Enter → Saves
- [ ] Press Escape → Cancels
- [ ] Click ✓ → Saves
- [ ] Click ✕ → Cancels
- [ ] Graph updates on save
- [ ] Works for text nodes
- [ ] Works for object rows
