import { flattenTree } from "src/utils/json-editor-parser"

describe("flattenTree", () => {
  it("takes a tree representation of a JSON and flattens it into a set of nodes and edges", () => {
    const tree = [
      {
        "id": "1",
        "text": {
          "name": "root"
        },
        "children": [
          {
            "id": "2",
            "text": "colors",
            "parent": true,
            "children": [
              {
                "id": "3",
                "text": "red",
                "children": [],
                "parent": false
              },
              {
                "id": "4",
                "text": "green",
                "children": [],
                "parent": false
              },
              {
                "id": "5",
                "text": "blue",
                "children": [],
                "parent": false
              }
            ]
          }
        ],
        "parent": false
      }
    ]
    const flatTree = [
      {
        "id": "1",
        "text": {
          "name": "root"
        },
        "parent": false
      },
      {
        "id": "2",
        "text": "colors",
        "parent": true
      },
      {
        "id": "3",
        "text": "red",
        "parent": false
      },
      {
        "id": "4",
        "text": "green",
        "parent": false
      },
      {
        "id": "5",
        "text": "blue",
        "parent": false
      },
      {
        "id": "e1-2",
        "from": "1",
        "to": "2"
      },
      {
        "id": "e2-3",
        "from": "2",
        "to": "3"
      },
      {
        "id": "e2-4",
        "from": "2",
        "to": "4"
      },
      {
        "id": "e2-5",
        "from": "2",
        "to": "5"
      }
    ]
    
    expect(flattenTree(tree)).toStrictEqual(flatTree)
  })
})

