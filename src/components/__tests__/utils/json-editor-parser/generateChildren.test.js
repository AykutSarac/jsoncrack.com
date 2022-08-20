import {privateMethods} from "src/utils/json-editor-parser"

describe("private_filterChild", () => {
  const {generateChildren} = privateMethods;

  it("generates children for a simple object with nested strings in array 'colors'", () => {
    const nextId = (
      (id) => () =>
        String(++id)
    )(0)

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
        "id": "1",
        "text": "colors",
        "parent": true,
        "children": [
          {
            "id": "2",
            "text": "red",
            "children": [],
            "parent": false
          },
          {
            "id": "3",
            "text": "green",
            "children": [],
            "parent": false
          },
          {
            "id": "4",
            "text": "blue",
            "children": [],
            "parent": false
          }
        ]
      }
    ]

    expect(generateChildren(simpleObject, nextId)).toStrictEqual(resultChildren)
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
    )(0)

    const simpleObject = {
      "name": "root",
      "colors": [
        "red"
      ]
    }
    const result = [
      {
        "id": "1",
        "text": "colors",
        "parent": true,
        "children": [
          {
            "id": "2",
            "text": "red",
            "children": [],
            "parent": false
          }
        ]
      }
    ]
    expect(generateChildren(simpleObject, nextId)).toStrictEqual(result)
  })

  it("simple object with two sibblings arrays", () => {
    const nextId = (
      (id) => () =>
        String(++id)
    )(0)

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
        "text": "colors",
        "parent": true,
        "children": [
          {
            "id": "2",
            "text": "red",
            "children": [],
            "parent": false
          },
          {
            "id": "3",
            "text": "blue,",
            "children": [],
            "parent": false
          }
        ]
      },
      {
        "id": "4",
        "text": "tags",
        "parent": true,
        "children": [
          {
            "id": "5",
            "text": "good-first-issue",
            "children": [],
            "parent": false
          },
          {
            "id": "6",
            "text": "bug",
            "children": [],
            "parent": false
          }
        ]
      }
    ]
    
    expect(generateChildren(simpleObject, nextId)).toStrictEqual(result)
  })
})
