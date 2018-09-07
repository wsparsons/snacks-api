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
      const response = await request(app).get(`/api/snacks/1`);
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
      const response = await request(app).get(`/api/snacks/one`);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        status: 404,
        message: "Snack with provided ID is not found"
      });
    });
  });

  describe("POST api/snacks", () => {
    test("should create a new snack when given a body", async () => {
      const startLength = await request(app).get(`/api/snacks`);
      const driedMangoes = {
        name: "Dried Mangoes",
        description:
          "Philippine Brand Dried Mangoes are the perfect any time snack! Packed with Vitamin C and high in fiber for a great and guilt-free alternative to other snacks.",
        price: 16,
        img:
          "https://images-na.ssl-images-amazon.com/images/I/912NRP3K5dL._SY450_.jpg",
        is_perishable: true
      };
      const response = await request(app)
        .post(`/api/snacks`)
        .send(driedMangoes);

      const endLength = await request(app).get(`/api/snacks`);

      expect(response.status).toBe(201);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data[0]).toBeInstanceOf(Object);
      expect(response.body.data[0]).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        img: expect.any(String),
        is_perishable: expect.any(Boolean)
      });
      expect(response.body.data[0].name).toEqual(driedMangoes.name);
      expect(endLength.body.data.length).toEqual(
        startLength.body.data.length + 1
      );
    });

    test("should return an error if there is missing params in the body", async () => {
      const driedMangoes = {
        description:
          "Philippine Brand Dried Mangoes are the perfect any time snack! Packed with Vitamin C and high in fiber for a great and guilt-free alternative to other snacks.",
        price: 16,
        img:
          "https://images-na.ssl-images-amazon.com/images/I/912NRP3K5dL._SY450_.jpg",
        is_perishable: true
      };
      const response = await request(app)
        .post(`/api/snacks`)
        .send(driedMangoes);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        status: 400,
        message: 'Snack "name" must be a String and is required'
      });
    });

    test("should return an error if there is invalid params the body", async () => {
      const driedMangoes = {
        name: "Dried Mangoes",
        description:
          "Philippine Brand Dried Mangoes are the perfect any time snack! Packed with Vitamin C and high in fiber for a great and guilt-free alternative to other snacks.",
        price: 16,
        img:
          "https://images-na.ssl-images-amazon.com/images/I/912NRP3K5dL._SY450_.jpg",
        is_perishable: true,
        is_yummy: true
      };

      const responseTitle = await request(app)
        .post(`/api/snacks`)
        .send({ ...driedMangoes, name: null });
      expect(responseTitle.status).toBe(400);
      expect(responseTitle.body).toMatchObject({
        status: 400,
        message: 'Snack "name" must be a String and is required'
      });

      const responseDescription = await request(app)
        .post(`/api/snacks`)
        .send({ ...driedMangoes, description: null });
      expect(responseDescription.status).toBe(400);
      expect(responseDescription.body).toMatchObject({
        status: 400,
        message: 'Snack "description" must be a String and is required'
      });

      const responsePrice = await request(app)
        .post(`/api/snacks`)
        .send({ ...driedMangoes, price: null });
      expect(responsePrice.status).toBe(400);
      expect(responsePrice.body).toMatchObject({
        status: 400,
        message:
          'Snack "price" must be an Integer (whole number, no Floats) and is required'
      });

      const responseImg = await request(app)
        .post(`/api/snacks`)
        .send({ ...driedMangoes, img: null });
      expect(responseImg.status).toBe(400);
      expect(responseImg.body).toMatchObject({
        status: 400,
        message: 'Snack "img" must be a String and is required'
      });

      const responsePerishable = await request(app)
        .post(`/api/snacks`)
        .send({ ...driedMangoes, is_perishable: null });
      expect(responsePerishable.status).toBe(400);
      expect(responsePerishable.body).toMatchObject({
        status: 400,
        message: 'Snack "is_perishable" must be a Boolean and is required'
      });
    });
  });

  describe("PATCH api/snacks/:id", () => {
    test("should update the snack when given id and body", async () => {
      const response = await request(app)
        .patch(`/api/snacks/1`)
        .send({
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

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data[0]).toBeInstanceOf(Object);
      expect(response.body.data[0]).toMatchObject(porkRinds);
      expect(response.body.data[0]).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        img: expect.any(String),
        is_perishable: expect.any(Boolean)
      });
      expect(response.body.data[0].name).toEqual("Yummy Pork Rinds");
      expect(response.body.data[0].price).toEqual(9);
    });

    test("should return an error if id is missing", async () => {
      const response = await request(app)
        .patch(`/api/snacks/`)
        .send({
          name: "Yummy Pork Rinds",
          price: 9
        });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        status: 404,
        message: "Could not PATCH /api/snacks/"
      });
    });

    test("should return an error if id is invalid", async () => {
      const response = await request(app)
        .patch(`/api/snacks/-1`)
        .send({
          name: "Yummy Pork Rinds",
          price: 9
        });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        status: 404,
        message: "Snack with provided ID is not found"
      });
    });

    test("should return an error if there is invalid params in the body", async () => {
      const response = await request(app)
        .patch(`/api/snacks/1`)
        .send({
          names: "Yummy Pork Rinds"
        });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        status: 400,
        message:
          'At lease one(1) of the following fields is required: "name", "description", "price", "img", or "is_perishable"'
      });
    });
  });

  describe("DELETE api/snacks/:id", () => {
    test("should delete a specific snack when given an id", async () => {
      const startLength = await request(app).get("/api/snacks");
      const response = await request(app).del(`/api/snacks/1`);
      const endLength = await request(app).get("/api/snacks");

      expect(response.status).toBe(202);
      expect(response.body.data[0].id).toEqual(1);
      expect(endLength.body.data.length).toEqual(
        startLength.body.data.length - 1
      );
    });

    test("should return an error if snack id is not found or invalid", async () => {
      const response = await request(app).del(`/api/snacks/one`);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        status: 404,
        message: "Snack with provided ID is not found"
      });
    });
  });
});
