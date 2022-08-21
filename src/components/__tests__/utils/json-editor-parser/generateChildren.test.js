import {privateMethods} from "src/utils/json-editor-parser"

describe("private_filterChild", () => {
  const {generateChildren} = privateMethods;
  it("generates children for a simple object with nested strings in array 'colors'", () => {
    const nextId = (
      (id) => () =>
        String(++id)
    )(1)

    const simpleObject = {
      "name": "root",
      "colors": [
        "red",
        "green",
        "blue"
      ]
    }

    const resultChildren = [
      {
        "id": "2",
        "text": "colors",
        "parent": true,
        "parent_id": "1",
        "children": [
          {
            "id": "3",
            "text": "red",
            "children": [],
            "parent_id": "2",
            "parent": false
          },
          {
            "id": "4",
            "text": "green",
            "children": [],
            "parent_id": "2",
            "parent": false
          },
          {
            "id": "5",
            "text": "blue",
            "children": [],
            "parent_id": "2",
            "parent": false
          }
        ]
      }
    ]

    expect(generateChildren(simpleObject, nextId, "1")).toStrictEqual(resultChildren)
  })

  it("generates children for an object without children", () => {
    const nextId = (
      (id) => () =>
        String(++id)
    )(0)

    const simpleObject = {
      "first_name": "jane",
      "last_name": "doe"
    }
    const resultChildren = []
    expect(generateChildren(simpleObject, nextId)).toStrictEqual(resultChildren)
  })
  it("generates children", () => {
    const nextId = (
      (id) => () =>
        String(++id)
    )(1)

    const simpleObject = {
      "name": "root",
      "colors": [
        "red"
      ]
    }
    const result = [
      {
        "id": "2",
        "text": "colors",
        "parent": true,
        "parent_id": "1",
        "children": [
          {
            "id": "3",
            "text": "red",
            "children": [],
            "parent_id": "2",
            "parent": false
          }
        ]
      }
    ]
    expect(generateChildren(simpleObject, nextId, "1")).toStrictEqual(result)
  })

  it("simple object with two sibblings arrays", () => {
    const nextId = (
      (id) => () =>
        String(++id)
    )(1)

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
    ]
    const a = generateChildren(simpleObject, nextId, "1")
    // console.log(JSON.stringify(a)) // TODO: Clean up
    expect(a).toStrictEqual(result)
  })
})
