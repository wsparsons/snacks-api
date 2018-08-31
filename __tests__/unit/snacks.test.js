const snacksModel = require("../../src/models/snacks");

// Working with async data
describe("Snacks Model", () => {
  describe("index()", () => {
    test("index function should exists", () => {
      expect(snacksModel.index).toBeDefined();
    });

    test("should return an array ", async () => {
      const response = await snacksModel.index();
      expect(Array.isArray(response)).toBe(true);
    });

    test("should contain a given snack", async () => {
      const response = await snacksModel.index();
      const olives = {
        id: 26,
        name: "Olives - Black, Pitted",
        description:
          "Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis.",
        price: 14,
        img:
          "https://sc02.alicdn.com/kf/HTB1Rp02KFXXXXXwXFXXq6xXFXXXG/Pitted-Black-Olives.jpg",
        is_perishable: true
      };
      expect(response).toEqual(
        expect.arrayContaining([expect.objectContaining(olives)])
      );
    });
  });

  describe("getSnackById()", () => {
    test("getSnackById function should exists", () => {
      expect(snacksModel.getSnackById).toBeDefined();
    });

    test("should return an object ", async () => {
      const response = await snacksModel.getSnackById(1);
      expect(typeof response).toBe("object");
    });

    test("should return a snack when given its id", async () => {
      const response = await snacksModel.getSnackById(1);
      const porkRinds = {
        id: 1,
        name: "Pork Rinds",
        description:
          "Mauris lacinia sapien quis libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis.",
        price: 8,
        img:
          "https://az808821.vo.msecnd.net/content/images/thumbs/0000398_salt-pepper-pork-rinds-2-oz_560.jpeg",
        is_perishable: true
      };
      expect.assertions(8); // Exactly 8 assertions are called during this test
      await expect(response).toEqual(porkRinds);
      await expect(response).toHaveProperty("id");
      await expect(response).toHaveProperty("name");
      await expect(response).toHaveProperty("price");
      await expect(response).toHaveProperty("description");
      await expect(response).toHaveProperty("img");
      await expect(response).toHaveProperty("is_perishable");
      await expect(response).toMatchObject(porkRinds);
    });

    test("should throw an error if id is invalid or missing", async () => {
      expect.assertions(4);

      await expect(snacksModel.getSnackById(1234)).rejects.toMatchObject({
        message: "snackNotFound"
      });
      await expect(snacksModel.getSnackById("two")).rejects.toMatchObject({
        message: "snackNotFound"
      });
      await expect(snacksModel.getSnackById(-1)).rejects.toMatchObject({
        message: "snackNotFound"
      });
      await expect(snacksModel.getSnackById()).rejects.toMatchObject({
        message: "snackNotFound"
      });
    });
  });

  describe("create()", () => {
    test("create function should exists", () => {
      expect(snacksModel.create).toBeDefined();
    });

    test("should create a new snack", async () => {
      const startLength = await snacksModel.index();
      console.log(startLength.length);

      const driedMangoes = {
        name: "Dried Mangos",
        description:
          "Philippine Brand Dried Mangoes are the perfect any time snack! Packed with Vitamin C and high in fiber for a great and guilt-free alternative to other snacks.",
        price: 16,
        img:
          "https://images-na.ssl-images-amazon.com/images/I/912NRP3K5dL._SY450_.jpg",
        is_perishable: true
      };
      const newSnack = await snacksModel.create(driedMangoes);
      const endLength = await snacksModel.index();

      expect.assertions(10);
      await expect(newSnack).toBeInstanceOf(Array);
      await expect(newSnack[0]).toBeInstanceOf(Object);
      await expect(newSnack[0]).toHaveProperty("id");
      await expect(newSnack[0]).toHaveProperty("name");
      await expect(newSnack[0]).toHaveProperty("description");
      await expect(newSnack[0]).toHaveProperty("price");
      await expect(newSnack[0]).toHaveProperty("img");
      await expect(newSnack[0]).toHaveProperty("is_perishable");
      await expect(newSnack[0]).toMatchObject(driedMangoes);
      await expect(endLength.length).toEqual(startLength.length + 1);
    });

    test("should throw an error if there are extra or missing params", async () => {
      const driedMangoes = {
        name: "Dried Mangos",
        description:
          "Philippine Brand Dried Mangoes are the perfect any time snack! Packed with Vitamin C and high in fiber for a great and guilt-free alternative to other snacks.",
        price: 16
      };
      expect.assertions(5);

      await expect(snacksModel.create(driedMangoes)).rejects.toMatchObject({
        message: "aFieldRequired"
      });
      await expect(snacksModel.create({ name: "apple" })).rejects.toMatchObject(
        {
          message: "aFieldRequired"
        }
      );
      await expect(
        snacksModel.create({ names: "apples" })
      ).rejects.toMatchObject({
        message: "aFieldRequired"
      });
      await expect(snacksModel.create({})).rejects.toMatchObject({
        message: "aFieldRequired"
      });
      await expect(
        snacksModel.create({
          ...driedMangoes,
          img:
            "https://images-na.ssl-images-amazon.com/images/I/912NRP3K5dL._SY450_.jpg",
          is_perishable: true,
          is_yummy: true
        })
      ).rejects.toMatchObject({
        message: "aFieldRequired"
      });
    });
  });
});
