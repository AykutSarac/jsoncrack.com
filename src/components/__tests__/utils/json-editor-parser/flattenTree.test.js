import { flattenTree } from "src/utils/json-editor-parser"

describe("flattenTree", () => {
  it("takes a tree representation of a JSON and flattens it into a set of nodes and edges", () => {
    const tree = [
      {
        "id": "2",
        "text": "colors",
        "parent": true,
        "parent_id": "1",
        "children": [
          {
            "id": "3",
            "text": "red",
            "parent_id": "2",
            "children": [],
            "parent": false
          }
        ]
      }
    ]
    
    const flatTree = [
      {
        "id": "1",
        "text": "parent",
        "parent": true
      },
      {
        "id": "2",
        "text": "colors",
        "parent": true,
        "parent_id": "1"
      },
      {
        "id": "3",
        "text": "red",
        "parent_id": "2",
        "parent": false
      },
      {
        "id": "e2-1",
        "from": "2",
        "to": "1"
      },
      {
        "id": "e2-3",
        "from": "2",
        "to": "3"
      }
    ]
    
    expect(flattenTree(tree)).toStrictEqual(flatTree)
  })
})

