import { beforeEach, describe, expect, test } from "@jest/globals";
import jsonToGoModule from "../lib/utils/json2go";

// create a type for json2go because it is a simple .js file so we can better test it in typeScript

// create a function type definition and add it to the json2go function
type JsonToGoFn = (
  json: string,
  typename?: string,
  flatten?: boolean,
  example?: boolean,
  allOmitempty?: boolean
) => { go: string; error?: string };
const jsonToGo = jsonToGoModule as unknown as JsonToGoFn;

// check that each tests has assertions
beforeEach(() => {
  expect.hasAssertions();
});

// Fabian Eberhardt
// the json2go function should generate golang (go) code from the json it gets
describe("jsonToGo tests", () => {
  describe("invalid json tests", () => {
    test("returns an error and empty output for not valid json", () => {
      // Arrange
      const invalid = "{ not valid json";

      // Act
      const result = jsonToGo(invalid);

      // Assert
      expect(result.go).toBe("");
      expect(result.error).toBeDefined();
    });
  });

  describe("check working result types tests", () => {
    test("returns struct with default struct name and right fields", () => {
      // Arrange
      const valid = '{"name":"Matt","age":30}';

      // Act
      const { go } = jsonToGo(valid);

      // Assert
      expect(go).toContain("type Root struct {");
      expect(go).toContain('Name string `json:"name"`');
      expect(go).toContain('Age int `json:"age"`');
      expect(go).toContain("}");
    });

    test("returns struct with the given type name", () => {
      // Arrange / Act
      const { go } = jsonToGo('{"a":1}', "my type");

      // Assert
      expect(go).toContain("type MyType struct {");
      expect(go).toContain('A int `json:"a"`');
      expect(go).toContain("}");
    });
  });

  describe("number types conversion tests", () => {
    test("returns a field with int", () => {
      // Arrange / Act
      const { go } = jsonToGo('{"number":321}');

      // Assert
      expect(go).toContain('Number int `json:"number"`');
    });
    test("returns a field with int64 for a number larger than 32 bit", () => {
      // Arrange / Act
      const { go } = jsonToGo('{"big":3000000000}');

      // Assert
      expect(go).toContain('Big int64 `json:"big"`');
    });

    test("returns a float64 for a float number", () => {
      // Arrange / Act
      const { go } = jsonToGo('{"pi":3.14}');

      // Assert
      expect(go).toContain('Pi float64 `json:"pi"`');
    });

    test("returns a float64 for a float number that could also be a int", () => {
      // Arrange / Act
      const { go } = jsonToGo('{"x":1.0}');

      // Assert
      expect(go).toContain('X float64 `json:"x"`');
    });
  });

  describe("null type conversion tests", () => {
    test("maps null to any", () => {
      // Arrange / Act
      const { go } = jsonToGo('{"x":null}');

      // Assert
      expect(go).toContain('X any `json:"x"`');
    });

    test("maps timestamp string to time.Time", () => {
      // Arrange / Act
      const { go } = jsonToGo('{"created":"2020-01-01T00:00:00Z"}');

      // Assert
      expect(go).toContain('Created time.Time `json:"created"`');
    });
  });

  describe("arrays mapping tests", () => {
    test("maps an array of strings to a Go slice", () => {
      // Arrange / Act
      const { go } = jsonToGo('{"tags":["a","b"]}');

      // Assert
      expect(go).toContain('Tags []string `json:"tags"`');
    });
  });

  describe("map nested objects tests", () => {
    test("hoists nested structs into their own type definitions when flattened", () => {
      // Arrange / Act — flatten defaults to true
      const { go } = jsonToGo('{"user":{"name":"Matt"}}');

      // Assert
      expect(go).toContain('User User `json:"user"`');
      expect(go).toContain("type User struct {");
    });

    test("inlines nested structs when flatten is disabled", () => {
      // Arrange / Act
      const { go } = jsonToGo('{"user":{"name":"Matt"}}', "Root", false);

      // Assert
      expect(go).toContain("User struct {");
      expect(go).not.toContain("type User struct {");
    });
  });

  describe("json key mapping tests", () => {
    test("upper-cases common initialisms such as id -> ID", () => {
      // Arrange / Act
      const { go } = jsonToGo('{"id":5}');

      // Assert
      expect(go).toContain('ID int `json:"id"`');
    });
  });
});
