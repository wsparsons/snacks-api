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
      expect(response[0]).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        img: expect.any(String),
        is_perishable: expect.any(Boolean)
      });
    });
  });

  describe("getSnackById()", () => {
    test("getSnackById function should exists", () => {
      expect(snacksModel.getSnackById).toBeDefined();
    });

    test("should return an object ", async () => {
      const response = await snacksModel.getSnackById(1);
      expect(response).toBeInstanceOf(Object);
    });

    test("should return a snack when given an id", async () => {
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

      // expect.assertions(8); // Exactly 8 assertions are called during this test
      expect(response).toEqual(porkRinds);
      expect(response).toHaveProperty("id");
      expect(response).toHaveProperty("name");
      expect(response).toHaveProperty("price");
      expect(response).toHaveProperty("description");
      expect(response).toHaveProperty("img");
      expect(response).toHaveProperty("is_perishable");
      expect(response).toMatchObject(porkRinds);
      expect(response).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        img: expect.any(String),
        is_perishable: expect.any(Boolean)
      });
    });

    test("should throw an error if id is invalid or missing", async () => {
      expect.assertions(4); // Exactly 4 assertions are called during this test
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

  describe("getFeatured()", () => {
    test("getFeatured function should exists", () => {
      expect(snacksModel.getFeatured).toBeDefined();
    });

    test("should return an array of 3 snacks", async () => {
      const response = await snacksModel.getFeatured();

      expect(response).toBeInstanceOf(Array);
      expect(response).toHaveLength(3);
      expect(response[0]).toBeInstanceOf(Object);
      expect(response[0]).toHaveProperty("id");
      expect(response[0]).toHaveProperty("name");
      expect(response[0]).toHaveProperty("description");
      expect(response[0]).toHaveProperty("price");
      expect(response[0]).toHaveProperty("img");
      expect(response[0]).toHaveProperty("is_perishable");
      expect(response[0]).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        img: expect.any(String),
        is_perishable: expect.any(Boolean)
      });
    });
  });

  describe("create()", () => {
    test("create function should exists", () => {
      expect(snacksModel.create).toBeDefined();
    });

    test("should create a new snack", async () => {
      const startLength = await snacksModel.index();

      const driedMangoes = {
        name: "Dried Mangos",
        description:
          "Philippine Brand Dried Mangoes are the perfect any time snack! Packed with Vitamin C and high in fiber for a great and guilt-free alternative to other snacks.",
        price: 16,
        img:
          "https://images-na.ssl-images-amazon.com/images/I/912NRP3K5dL._SY450_.jpg",
        is_perishable: true
      };

      const response = await snacksModel.create(driedMangoes);
      const endLength = await snacksModel.index();

      expect(response).toBeInstanceOf(Array);
      expect(response[0]).toBeInstanceOf(Object);
      expect(response[0]).toHaveProperty("id");
      expect(response[0]).toHaveProperty("name");
      expect(response[0]).toHaveProperty("description");
      expect(response[0]).toHaveProperty("price");
      expect(response[0]).toHaveProperty("img");
      expect(response[0]).toHaveProperty("is_perishable");
      expect(response[0]).toMatchObject(driedMangoes);
      expect(response[0]).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        img: expect.any(String),
        is_perishable: expect.any(Boolean)
      });
      expect(endLength.length).toEqual(startLength.length + 1);
    });

    test("should throw an error if there is extra or missing params", async () => {
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
        { message: "aFieldRequired" }
      );
      await expect(
        snacksModel.create({ names: "apples" })
      ).rejects.toMatchObject({ message: "aFieldRequired" });
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
      ).rejects.toMatchObject({ message: "aFieldRequired" });
    });
  });

  describe("update()", () => {
    test("update function should exists", () => {
      expect(snacksModel.update).toBeDefined();
    });

    test("should update the snack with given params", async () => {
      const response = await snacksModel.update(1, {
        name: "Yummy Pork Rinds",
        price: 9
      });

      const porkRinds = {
        id: 1,
        name: "Yummy Pork Rinds",
        description:
          "Mauris lacinia sapien quis libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis.",
        price: 9,
        img:
          "https://az808821.vo.msecnd.net/content/images/thumbs/0000398_salt-pepper-pork-rinds-2-oz_560.jpeg",
        is_perishable: true
      };

      expect(response).toBeInstanceOf(Array);
      expect(response[0]).toBeInstanceOf(Object);
      expect(response[0]).toHaveProperty("id");
      expect(response[0]).toHaveProperty("name");
      expect(response[0]).toHaveProperty("description");
      expect(response[0]).toHaveProperty("price");
      expect(response[0]).toHaveProperty("img");
      expect(response[0]).toHaveProperty("is_perishable");
      expect(response[0]).toMatchObject(porkRinds);
      expect(response[0]).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        img: expect.any(String),
        is_perishable: expect.any(Boolean)
      });
      expect(response[0].name).toEqual("Yummy Pork Rinds");
      expect(response[0].price).toEqual(9);
    });

    test("should throw an error if id is invalid or missing", async () => {
      expect.assertions(5);
      await expect(
        snacksModel.update("1234", {
          name: "Yummy Pork Rinds",
          price: 9
        })
      ).rejects.toMatchObject({
        message: "snackNotFound"
      });
      await expect(
        snacksModel.update("two", {
          name: "Yummy Pork Rinds",
          price: 9
        })
      ).rejects.toMatchObject({
        message: "snackNotFound"
      });
      await expect(
        snacksModel.update(-1, {
          name: "Yummy Pork Rinds",
          price: 9
        })
      ).rejects.toMatchObject({
        message: "snackNotFound"
      });
      await expect(
        snacksModel.update({
          name: "Yummy Pork Rinds",
          price: 9
        })
      ).rejects.toMatchObject({
        message: "snackNotFound"
      });
      await expect(
        snacksModel.update(null, { name: "Yummy Pork Rinds", price: 9 })
      ).rejects.toMatchObject({ message: "snackNotFound" });
    });

    test("should throw an error if if there is invalid or no params in the body", async () => {
      expect.assertions(3);

      await expect(snacksModel.update(1, {})).rejects.toMatchObject({
        message: "aFieldRequired"
      });
      await expect(
        snacksModel.update(1, { names: "Yummy Pork Rinds" })
      ).rejects.toMatchObject({
        message: "aFieldRequired"
      });
      await expect(
        snacksModel.update(1, {
          name: "Yummy Pork Rinds",
          description:
            "Mauris lacinia sapien quis libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis.",
          price: 9,
          img:
            "https://az808821.vo.msecnd.net/content/images/thumbs/0000398_salt-pepper-pork-rinds-2-oz_560.jpeg",
          is_perishable: true,
          is_yummy: true
        })
      ).rejects.toMatchObject({
        message: "aFieldRequired"
      });
    });
  });

  describe("destroy()", () => {
    test("destroy function should exists", () => {
      expect(snacksModel.destroy).toBeDefined();
    });

    test("should delete a snack when given an id", async () => {
      const startLength = await snacksModel.index();
      const response = await snacksModel.destroy(1);
      const endLength = await snacksModel.index();
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

      expect(endLength.length).toEqual(startLength.length - 1);
      expect(response[0]).toEqual(porkRinds);
      expect(response[0]).toMatchObject(porkRinds);
      expect(response[0]).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        img: expect.any(String),
        is_perishable: expect.any(Boolean)
      });
    });

    test("should throw an error if id is invalid or missing", async () => {
      expect.assertions(3);
      await expect(snacksModel.destroy("two")).rejects.toMatchObject({
        message: "snackNotFound"
      });
      await expect(snacksModel.destroy(-1)).rejects.toMatchObject({
        message: "snackNotFound"
      });
      await expect(snacksModel.destroy()).rejects.toMatchObject({
        message: "snackNotFound"
      });
    });
  });
});
