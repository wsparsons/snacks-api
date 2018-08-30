const snacksModel = require("../../src/models/snacks");

// Working with async data
describe("Snacks Model", () => {
  describe("index()", () => {
    test("should return an array ", async () => {
      const response = await snacksModel.index();

      expect(Array.isArray(response)).toBe(true);
    });
  });
});
