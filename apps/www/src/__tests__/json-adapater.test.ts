import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test
} from "@jest/globals";

import {contentToJson, jsonToContent} from "../lib/utils/jsonAdapter";
import { FileFormat } from "../enums/file.enum";

beforeEach(() => {
  expect.hasAssertions();
});


// Stefan Czepl
describe("JsonAdapter Tests", () => {

    describe("ContentToJson Json Format", () => {
        test("expect empty String to return empty object", async () => {
            // Arrange
            const content:string = "";
            const expected = {};

            // Act
            const actual = await contentToJson(content);

            // Assert
            expect(actual).toEqual(expected);
        });

        test("expect valid Json String to return correct object", async () => {
            // Arrange
            const content:string = '{"name": "John", "age": 30}';
            const expected = { name: "John", age: 30 };

            // Act
            const actual = await contentToJson(content);

            // Assert
            expect(actual).toEqual(expected);
        });

        test("expect invalid Json String to throw SyntaxError", async () => {
            // Arrange
            const content:string = '{"name": "John", "age": 30'; // Missing closing brace

            // Act & Assert
            await expect(contentToJson(content)).rejects.toThrow(SyntaxError);
        });
        });

    describe("ContentToJson Yaml Format", () => {
        test("expect empty String to return empty object", async () => {
            // Arrange
            const content:string = "";
            const expected = {};

            // Act
            const actual = await contentToJson(content, FileFormat.YAML);

            // Assert
            expect(actual).toEqual(expected);
        });

        test("expect valid Yaml String to return correct object", async () => {
            // Arrange
            const content:string = "name: John\nage: 30";
            const expected = { name: "John", age: 30 };

            // Act
            const actual = await contentToJson(content, FileFormat.YAML);

            // Assert
            expect(actual).toEqual(expected);
        });

        test("expect invalid Yaml String to throw SyntaxError", async () => {
            // Arrange
            const content:string = "name: John\nage: 30:"; // Invalid YAML syntax

            // Act & Assert
            await expect(contentToJson(content, FileFormat.YAML)).rejects.toThrow();
        });
    });

    describe("ContentToJson Xml Format", () => {
        test("expect empty String to return empty object", async() => {
            // Arrange
            const content:string = "";
            const expected = {};

            // Act
            const actual = await contentToJson(content, FileFormat.XML);

            // Assert
            expect(actual).toEqual(expected);
        })

        test("expect valid Xml String to return correct object", async() => {
            // Arrange
            const content:string = "<person><name>John</name><age>30</age></person>";
            const expected = { person: { name: "John", age: 30 } };

            // Act
            const actual = await contentToJson(content, FileFormat.XML);

            // Assert
            expect(actual).toEqual(expected);
        })

        test("expect invalid Xml String to still pass object", async() => {
            // Arrange
            const content:string = "<person><name>John</name><age>30</age>"; // Missing closing tag
            const expected = { person: { name: "John", age: 30 } };

            // Act
            const actual = await contentToJson(content, FileFormat.XML);

            // Act & Assert
            expect(actual).toEqual(expected);
        })
    });

    describe("jsonToContent - JSON format", () => {
      test("empty String returns empty String", async () => {
        // Arrange
        const json = "";
    
        // Act
        const actual = await jsonToContent(json, FileFormat.JSON);
    
        // Assert
        expect(actual).toBe("");
      });
    
      test("compact JSON is returned pretty-printed with 2 spaces", async () => {
        // Arrange
        const json = '{"name":"John","age":30}';
        const expected = '{\n  "name": "John",\n  "age": 30\n}';
    
        // Act
        const actual = await jsonToContent(json, FileFormat.JSON);
    
        // Assert
        expect(actual).toBe(expected);
      });
    
      test("invalid JSON is returned unchanged (catch branch)", async () => {
        // Arrange
        const json = "{not valid json";
        // suppress the expected console.error noise from the catch branch
        const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    
        // Act
        const actual = await jsonToContent(json, FileFormat.JSON);
    
        // Assert
        expect(actual).toBe(json);
        errorSpy.mockRestore();
      });
    });
    
    describe("jsonToContent - YAML format", () => {
      test("valid JSON String is converted to YAML", async () => {
        // Arrange
        const json = '{"name":"John","age":30}';
    
        // Act
        const actual = await jsonToContent(json, FileFormat.YAML);
    
        // Assert
        expect(actual).toContain("name: John");
        expect(actual).toContain("age: 30");
      });
    });
    
});