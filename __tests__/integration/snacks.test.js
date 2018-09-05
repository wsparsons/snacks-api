const app = require("../../src/app");
const request = require("supertest");

describe("/api/snacks", () => {
  describe("GET api/snacks", () => {
    test("should return all snacks", async () => {
      const response = await request(app).get("/api/snacks");
      const snacksArray = response.body.data;

      expect(response.status).toBe(201);
      expect(snacksArray).toBeInstanceOf(Array);
      expect(snacksArray[0]).toBeInstanceOf(Object);
      expect(snacksArray[0]).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        img: expect.any(String),
        is_perishable: expect.any(Boolean),
        reviews: expect.any(Array)
      });
      expect(response.type).toBe("application/json");
    });
  });

  describe("GET api/snacks/featured", () => {
    test("should return three featured snacks", async () => {
      const response = await request(app).get("/api/snacks/featured");
      const featuredArray = response.body.data;

      expect(response.status).toBe(201);
      expect(featuredArray.length).toEqual(3);
      expect(featuredArray).toBeInstanceOf(Array);
      expect(featuredArray[0]).toBeInstanceOf(Object);
      expect(featuredArray[0]).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        img: expect.any(String),
        is_perishable: expect.any(Boolean)
      });
    });
  });

  describe("GET api/snacks/:id", () => {
    test("should return a specific snack when given an id", async () => {
      const response = await request(app).get(`/api/snacks/${1}`);
      const snack = response.body.data;

      expect(response.status).toBe(201);
      expect(snack).toBeInstanceOf(Object);
      expect(snack).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        img: expect.any(String),
        is_perishable: expect.any(Boolean),
        reviews: expect.any(Array)
      });
      expect(snack.id).toEqual(1);
    });

    test("should return an error if given id is invalid or missing", async () => {
      const response = await request(app).get(`/api/snacks/${"one"}`);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        status: 404,
        message: "Snack with provided ID is not found"
      });
    });
  });

  describe("POST api/snacks", () => {
    test("should create a new snack", async () => {
      const startLength = await request(app).get("/api/snacks");
      const driedMangoes = {
        name: "Dried Mangos",
        description:
          "Philippine Brand Dried Mangoes are the perfect any time snack! Packed with Vitamin C and high in fiber for a great and guilt-free alternative to other snacks.",
        price: 16,
        img:
          "https://images-na.ssl-images-amazon.com/images/I/912NRP3K5dL._SY450_.jpg",
        is_perishable: true
      };
      const response = await request(app).post(`/api/snacks/${driedMangoes}`);
      const endLength = await request(app).get("/api/snacks");

      // console.log(response.body.data);

    });
  });

  describe("DELETE api/snacks/:id", () => {
    test("should delete a specific snack when given an id", async () => {
      const startLength = await request(app).get("/api/snacks");
      const response = await request(app).del(`/api/snacks/${1}`);
      const endLength = await request(app).get("/api/snacks");

      expect(response.status).toBe(202);
      expect(response.body.data[0].id).toEqual(1);
      expect(endLength.body.data.length).toEqual(
        startLength.body.data.length - 1
      );
    });

    test("should return an error if snack is not found", async () => {
      const response = await request(app).del(`/api/snacks/${"one"}`);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        status: 404,
        message: "Snack with provided ID is not found"
      });
    });
  });
});
