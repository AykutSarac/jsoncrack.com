import { extractTree } from "src/utils/json-editor-parser"

describe("extractTree", () => {
  /*
  it("takes a parsed JSON and extracts a tree representation of the JSON", () => {
    const parsedJson = [
      {
        "name": "root",
        "colors": [
          "red",
          "green",
          "blue"
        ]
      }
    ]
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
    expect(extractTree(parsedJson)).toStrictEqual(tree)
  })
  */
  it("simple object with two sibblings arrays", () => {
    const simpleObject = {
      "name": "root",
      "colors": [
        "red",
        "blue,"
      ],
      "tags": [
        "good-first-issue",
        "bug"
      ]
    }
    const result = [
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
            "parent_id": "1",
            "children": [
              {
                "id": "4",
                "text": "red",
                "children": [],
                "parent_id": "2",
                "parent": false
              },
              {
                "id": "5",
                "text": "blue,",
                "children": [],
                "parent_id": "2",
                "parent": false
              }
            ]
          },
          {
            "id": "3",
            "text": "tags",
            "parent": true,
            "parent_id": "1",
            "children": [
              {
                "id": "6",
                "text": "good-first-issue",
                "children": [],
                "parent_id": "3",
                "parent": false
              },
              {
                "id": "7",
                "text": "bug",
                "children": [],
                "parent_id": "3",
                "parent": false
              }
            ]
          }
        ],
        "parent_id": null,
        "parent": false
      }
    ]
    const a = extractTree(simpleObject)
    // console.log(JSON.stringify(a)) // TODO:  Cleanup
    expect(a).toStrictEqual(result)
  })
  /*
  it("simple object with no children", () => {
    const simpleObject = [
      {
        "first_name": "jane",
        "last_name": "doe"
      }
    ]
    const result = [
      {
        "id": "1",
        "text": {
          "first_name": "jane",
          "last_name": "doe"
        },
        "children": [],
        "parent": false
      }
    ]
    expect(extractTree(simpleObject)).toStrictEqual(result)
  })

  it("simple object with only one element inside array in children", () => {
    const simpleObject = [
      {
        "name": "root",
        "colors": [
          "red",
        ]
      }
    ]
    const result = [
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
              }
            ]
          }
        ],
        "parent": false
      }
    ]
    expect(extractTree(simpleObject)).toStrictEqual(result)
  })
  */
})
