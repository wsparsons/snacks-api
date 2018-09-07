const app = require("../../src/app");
const request = require("supertest");

describe("/api/snacks", () => {
  describe("POST api/snacks/:id/reviews", () => {
    test("should create a new review when given a snack id and body", async () => {
      const startLength = await request(app).get("/api/snacks/1");
      const newReview = {
        title: "Yummy!",
        text: "This snack was supercalifragilisticexpialidocious.",
        rating: 5
      };
      const response = await request(app)
        .post(`/api/snacks/1/reviews`)
        .send(newReview);
      const endLength = await request(app).get("/api/snacks/1");

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data[0]).toBeInstanceOf(Object);
      expect(response.body.data[0]).toMatchObject({
        id: expect.any(Number),
        title: expect.any(String),
        text: expect.any(String),
        rating: expect.any(Number),
        snack_id: expect.any(Number)
      });
      expect(endLength.body.data.reviews.length).toEqual(
        startLength.body.data.reviews.length + 1
      );
    });

    test("should return an error if snack id is invalid or missing", async () => {
      const newReview = {
        title: "Yummy!",
        text: "This snack was supercalifragilisticexpialidocious.",
        rating: 5
      };
      const response = await request(app)
        .post(`/api/snacks/one/reviews`)
        .send(newReview);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        status: 404,
        message: "Snack with provided ID is not found"
      });
    });

    test("should return an error if there is invalid or missing params in the body", async () => {
      const newReview = {
        title: "Yummy!",
        text: "This snack was supercalifragilisticexpialidocious.",
        rating: 5
      };

      const responseTitle = await request(app)
        .post(`/api/snacks/1/reviews`)
        .send({ ...newReview, title: ["Yummy!"] });
      expect(responseTitle.status).toBe(400);
      expect(responseTitle.body).toMatchObject({
        status: 400,
        message: 'Review "title" must be a String and is required'
      });

      const responseText = await request(app)
        .post(`/api/snacks/1/reviews`)
        .send({
          ...newReview,
          text: ["supercalifragilisticexpialidocious."]
        });
      expect(responseText.status).toBe(400);
      expect(responseText.body).toMatchObject({
        status: 400,
        message: 'Review "text" must be a String and is required'
      });

      const responseRating = await request(app)
        .post(`/api/snacks/1/reviews`)
        .send({
          ...newReview,
          rating: [5]
        });
      expect(responseRating.status).toBe(400);
      expect(responseRating.body).toMatchObject({
        status: 400,
        message:
          'Review "rating" must be an Integer (whole number, no Floats between 1 and 5) and is required'
      });
    });
  });

  describe("PATCH api/snacks/:id/reviews/:revId", () => {
    test("should update the review when given id, revId and body", async () => {
      const response = await request(app)
        .patch(`/api/snacks/1/reviews/1`)
        .send({
          title: "Yummy!",
          rating: 5
        });
      const updatedReview = {
        id: 1,
        title: "Yummy!",
        text:
          "If it were a person I'd say to it: Is your name Dan Druff? You get into people's hair. I mean like, I'd say that you're funny but looks aren't everything.",
        rating: 5,
        snack_id: 1
      };

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data[0]).toBeInstanceOf(Object);
      expect(response.body.data[0]).toMatchObject(updatedReview);
      expect(response.body.data[0]).toMatchObject({
        id: expect.any(Number),
        title: expect.any(String),
        text: expect.any(String),
        rating: expect.any(Number),
        snack_id: expect.any(Number)
      });
      expect(response.body.data[0].title).toEqual("Yummy!");
      expect(response.body.data[0].rating).toEqual(5);
    });

    test("should return an error if revId is missing", async () => {
      const response = await request(app)
        .patch(`/api/snacks/1/reviews`)
        .send({
          title: "Yummy!",
          rating: 5
        });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        status: 404,
        message: "Could not PATCH /api/snacks/1/reviews"
      });
    });

    test("should return an error if id is invalid", async () => {
      const response = await request(app)
        .patch(`/api/snacks/1/reviews/-1`)
        .send({
          title: "Yummy!",
          rating: 5
        });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        status: 404,
        message: "Review with provided ID is not found"
      });
    });

    test("should return an error if there is invalid params in the body", async () => {
      const response = await request(app)
        .patch(`/api/snacks/1/reviews/1`)
        .send({
          titles: "Yummy!"
        });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        status: 400,
        message:
          'At lease one(1) of the following fields is required: "title", "text", "rating" '
      });
    });
  });

  describe("DELETE api/snacks/:id/reviews/:revId", () => {
    test("should delete a specific snack review when given snack id and review id", async () => {
      const startLength = await request(app).get("/api/snacks/1");
      const response = await request(app).del(`/api/snacks/1/reviews/1`);
      const endLength = await request(app).get("/api/snacks/1");
      const delReview = {
        id: 1,
        title: "Incredible!",
        text:
          "If it were a person I'd say to it: Is your name Dan Druff? You get into people's hair. I mean like, I'd say that you're funny but looks aren't everything.",
        rating: 1,
        snack_id: 1
      };

      expect(response.status).toBe(202);
      expect(response.body.data[0]).toMatchObject(delReview);
      expect(response.body.data[0].id).toEqual(1);
      expect(endLength.body.data.reviews.length).toEqual(
        startLength.body.data.reviews.length - 1
      );
    });

    test("should return an error if snack id is not found or invalid", async () => {
      const response = await request(app).del(`/api/snacks/1/reviews/one`);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        status: 404,
        message: "Review with provided ID is not found"
      });
    });
  });
});
