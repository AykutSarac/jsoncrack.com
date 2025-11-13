# Testing Guide: Inline Edit Feature

## Quick Start - Development Server

### 1. Install Dependencies (One-time only)
```powershell
pnpm install
```

### 2. Start Development Server
```powershell
pnpm dev
```

**Expected output:**
```
> next dev

  ▲ Next.js 14.2.28
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 1234ms
```

The app will be available at: `http://localhost:3000`

---

### 3. Build TypeScript (Optional - but recommended first)
```powershell
pnpm run lint
```

This runs:
```
tsc --project tsconfig.json && eslint src && prettier --check src
```

**Expected output:**
```
✓ TypeScript compilation successful
✓ No ESLint errors
✓ Code formatting is correct
```

---

## Testing the Inline Edit Feature

### Step 1: Start the Dev Server
```powershell
pnpm dev
```

### Step 2: Open in Browser
Navigate to: `http://localhost:3000`

### Step 3: Load Test Data
1. Click anywhere on the page
2. You should see sample JSON loaded
3. Look at the **left panel** (Monaco editor showing JSON text)
4. Look at the **right panel** (Graph visualization)

### Step 4: Test Edit Button Visibility
1. Look at nodes in the graph visualization
2. Hover over a node - you should see an **✎ (edit button)** appear next to it
3. This confirms the edit button styling is working

### Step 5: Test Simple Value Edit (Text Node)
1. Find a **simple value node** (like a string, number, or boolean)
2. Click the **✎ edit button** next to it
3. Verify:
   - ✅ Input field appears (replaces the value)
   - ✅ Input auto-focuses (cursor visible)
   - ✅ Text is auto-selected (highlighted)
   - ✅ Save (✓) and Cancel (✕) buttons appear

### Step 6: Test Edit Cancel (Escape Key)
1. Click edit button on a node
2. Type a new value
3. Press **Escape** key
4. Verify:
   - ✅ Editor disappears
   - ✅ Original value is restored
   - ✅ No JSON changed
   - ✅ Left editor text unchanged

### Step 7: Test Edit Cancel (Cancel Button)
1. Click edit button on a node
2. Type a new value
3. Click **✕ (cancel button)**
4. Verify:
   - ✅ Editor disappears
   - ✅ Original value restored
   - ✅ No JSON changed

### Step 8: Test Edit Save (Enter Key)
1. Click edit button on a node with value `"hello"`
2. Type `"world"`
3. Press **Enter** key
4. Verify:
   - ✅ Editor disappears
   - ✅ Node now shows `"world"`
   - ✅ **Left editor text updates** (most important!)
   - ✅ No "unsaved changes" indicator

### Step 9: Test Edit Save (Save Button)
1. Click edit button on a node with value `123`
2. Type `456`
3. Click **✓ (save button)**
4. Verify:
   - ✅ Editor disappears
   - ✅ Node shows `456`
   - ✅ **Left editor text updates** (NEW FEATURE!)
   - ✅ JSON is formatted correctly in editor

### Step 10: Test Object Row Edit
1. Find an **object node** (shows multiple key-value pairs)
2. Click edit button on a specific **row** (e.g., name: "John")
3. Verify:
   - ✅ Input appears for just that row value
   - ✅ Key name shows: `name: [input]`
   - ✅ Save/Cancel buttons appear

### Step 11: Test Type Conversion
1. Edit a number field: `123`
2. Type: `"456"` (with quotes)
3. Press Enter
4. Verify in left editor: value is **string** `"456"` not number
5. Edit boolean field: `true`
6. Type: `false`
7. Press Enter
8. Verify in left editor: value is **boolean** not string

### Step 12: Test Multiple Edits
1. Edit node A, save
2. Verify graph updates ✓
3. Verify editor updates ✓
4. Edit node B, save
5. Verify both A and B have correct values
6. Edit node A again to different value
7. Verify editor shows new value for A

---

## Automated Testing (if tests exist)

### Run Tests
```powershell
npm test
```
or
```powershell
pnpm test
```

**Note:** Check if `package.json` has a `test` script in the `scripts` section.

---

## Browser DevTools Testing

### 1. Open Browser DevTools
Press: `F12` or `Ctrl+Shift+I`

### 2. Console Tab
Watch for any errors when:
- Clicking edit button
- Typing in editor
- Pressing Save/Cancel
- Selecting different nodes

**Expected:** No red error messages

### 3. Network Tab
1. Edit a node and save
2. Look at Network tab
3. You should **NOT** see any API calls (it's all client-side state)
4. Graph should update instantly

### 4. React DevTools (if installed)
1. Install React DevTools extension for Chrome/Firefox
2. Click the React icon in DevTools
3. Edit a node
4. Expand the component tree
5. Look for `TextEditComponent` or `RowEditComponent`
6. Watch the state update in real-time

---

## Checklist: What Should Work

### Editor Integration ✅
- [ ] Edit node → JSON updates
- [ ] Edit node → Graph node updates
- [ ] Edit node → **Left editor panel updates** (NEW!)
- [ ] Edit node → No "unsaved changes" indicator

### UI/UX ✅
- [ ] Edit button appears on hover
- [ ] Input auto-focuses when editor opens
- [ ] Text auto-selects in input
- [ ] Enter key saves
- [ ] Escape key cancels
- [ ] Save button works
- [ ] Cancel button works
- [ ] Editor disappears after save/cancel

### Data Integrity ✅
- [ ] Values are correctly updated
- [ ] Types are preserved (string/number/boolean)
- [ ] Nested objects still work
- [ ] Arrays still work
- [ ] Cancel doesn't modify anything

### Graph Visualization ✅
- [ ] Nodes re-render with new values
- [ ] Node labels update immediately
- [ ] Graph layout adjusts if needed
- [ ] Can still pan/zoom graph

### Text Editor ✅
- [ ] Editor text updates when node saved
- [ ] Editor formatting is correct (indentation)
- [ ] Editor shows valid JSON
- [ ] Can still edit in text editor

---

## Debugging Tips

### If edit button doesn't appear:
1. Check browser console for errors
2. Verify `useNodeEdit` store is imported in component
3. Check that edit button styling is correct
4. Look for hover state in CSS

### If editor doesn't update left panel:
1. Check console for errors from `useFile.setContents()`
2. Verify `useFile` import is correct in `useJson.ts`
3. Check that `handleSave()` is calling `setContents()`
4. Verify the JSON is being updated correctly

### If Enter/Escape don't work:
1. Check `handleKeyDown()` in `TextEditComponent`
2. Verify `stopPropagation()` is called
3. Check keyboard event handler is attached to input
4. Look for conflicting keyboard shortcuts

### If values don't save:
1. Check `updateJsonByPath()` utility function
2. Verify the JSONPath is correct
3. Check `useJson.handleSave()` is being called
4. Look for errors in type conversion (`parseValueInput`)

---

## Command Reference

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Check TypeScript, ESLint, Prettier |
| `pnpm lint:fix` | Auto-fix linting issues |
| `pnpm analyze` | Build with bundle analyzer |

---

## Files Modified (For Reference)

1. `src/store/useJson.ts` - Added import + updated `handleSave()`
2. `src/features/editor/views/GraphView/CustomNode/TextEditComponent.tsx` - Created
3. `src/features/editor/views/GraphView/CustomNode/RowEditComponent.tsx` - Created
4. `src/features/editor/views/GraphView/CustomNode/TextNode.tsx` - Modified
5. `src/features/editor/views/GraphView/CustomNode/ObjectNode.tsx` - Modified
6. `src/features/editor/views/GraphView/CustomNode/styles.tsx` - Modified

---

## Expected Test Results

### ✅ All Tests Pass If:
1. Dev server starts without errors
2. Browser loads JSON Crack UI without crashes
3. Edit buttons appear and function
4. Text input focuses and selects
5. Enter/Escape/buttons work
6. Graph updates after save
7. **Left editor updates after save** (NEW!)
8. Cancel discards changes
9. Type conversion works
10. Multiple edits work in sequence

### ❌ Issues to Watch For:
1. "Cannot find module useFile" - check import in useJson.ts
2. "setContents is not a function" - check useFile export
3. Input doesn't focus - check useRef and useEffect
4. Graph doesn't update - check useGraph.setGraph()
5. Editor doesn't update - check useFile.setContents() call
6. Keyboard doesn't work - check event handlers and stopPropagation()

---

## Quick Test Script (Copy-paste ready)

### 1. Check TypeScript
```powershell
pnpm run lint
```

### 2. Start Server
```powershell
pnpm dev
```

### 3. Wait for output
```
✓ Ready in 1234ms
```

### 4. Open browser
```
http://localhost:3000
```

### 5. Manual test in browser:
- Load sample JSON ✓
- Click edit button ✓
- Type new value ✓
- Press Enter ✓
- Verify left editor updates ✓
- Verify no errors in console ✓

---

## Success Criteria

Your implementation is **complete and working** when:

✅ `pnpm run lint` passes with zero errors  
✅ `pnpm dev` starts the server successfully  
✅ Edit button appears on nodes  
✅ Edit input focuses and selects text  
✅ Save works (Enter key or Save button)  
✅ Cancel works (Escape key or Cancel button)  
✅ Graph nodes update with new values  
✅ **Left editor text updates with new JSON** (the key feature!)  
✅ No console errors appear  
✅ Multiple edits work in sequence  

If all of these pass, your implementation is **production-ready**! 🎉
