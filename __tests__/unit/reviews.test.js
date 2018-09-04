const reviewsModel = require("../../src/models/reviews");

describe("Reviews Model", () => {
  describe("getSnackReviews()", () => {
    test("getSnackReviews function exists", () => {
      expect(reviewsModel.getSnackReviews).toBeDefined();
    });

    test("should return an empty array or an array of reviews when given a snack's id", async () => {
      const response = await reviewsModel.getSnackReviews(1);
      expect(response).toBeInstanceOf(Array);
    });

    test("should throw an error if id is invalid or missing", async () => {
      expect.assertions(3);
      await expect(reviewsModel.getSnackReviews()).rejects.toMatchObject({
        message: "reviewNotFound"
      });
      await expect(reviewsModel.getSnackReviews("1")).rejects.toMatchObject({
        message: "reviewNotFound"
      });
      await expect(reviewsModel.getSnackReviews(-1)).rejects.toMatchObject({
        message: "reviewNotFound"
      });
    });
  });

  describe("getReviewById()", () => {
    test("getReviewById function exists", () => {
      expect(reviewsModel.getReviewById).toBeDefined();
    });

    test("should return an object", async () => {
      const response = await reviewsModel.getReviewById(1);
      expect(response).toBeInstanceOf(Object);
    });

    test("should return a review when given an id", async () => {
      const response = await reviewsModel.getReviewById(1);
      const review = {
        id: 1,
        title: "Incredible!",
        text:
          "If it were a person I'd say to it: Is your name Dan Druff? You get into people's hair. I mean like, I'd say that you're funny but looks aren't everything.",
        rating: 1,
        snack_id: 1
      };
      expect(response).toEqual(review);
      expect(response).toHaveProperty("id");
      expect(response).toHaveProperty("title");
      expect(response).toHaveProperty("text");
      expect(response).toHaveProperty("rating");
      expect(response).toHaveProperty("snack_id");
      expect(response).toMatchObject(review);
      expect(response).toMatchObject({
        id: expect.any(Number),
        title: expect.any(String),
        text: expect.any(String),
        rating: expect.any(Number),
        snack_id: expect.any(Number)
      });
    });

    test("should throw an error if id is invalid or missing", async () => {
      expect.assertions(3);
      await expect(reviewsModel.getReviewById()).rejects.toMatchObject({
        message: "reviewNotFound"
      });
      await expect(reviewsModel.getReviewById("1")).rejects.toMatchObject({
        message: "reviewNotFound"
      });
      await expect(reviewsModel.getReviewById(-1)).rejects.toMatchObject({
        message: "reviewNotFound"
      });
    });
  });

  describe("create()", () => {
    test("create function exist", () => {
      expect(reviewsModel.create).toBeDefined();
    });

    test("should create a new review", async () => {
      const newReview = {
        title: "Yummy!",
        text: "This snack was supercalifragilisticexpialidocious.",
        rating: 5
      };
      const response = await reviewsModel.create(1, newReview);

      expect(response).toBeInstanceOf(Array);
      expect(response).toHaveLength(1);
      expect(response[0]).toBeInstanceOf(Object);
      expect(response[0]).toHaveProperty("id");
      expect(response[0]).toHaveProperty("title");
      expect(response[0]).toHaveProperty("text");
      expect(response[0]).toHaveProperty("rating");
      expect(response[0]).toHaveProperty("snack_id");
      expect(response[0]).toMatchObject(newReview);
      expect(response[0]).toMatchObject({
        id: expect.any(Number),
        title: expect.any(String),
        text: expect.any(String),
        rating: expect.any(Number),
        snack_id: expect.any(Number)
      });
    });

    test("should throw an error if snack id is invalid or missing", async () => {
      const newReview = {
        title: "Yummy!",
        text: "This snack was supercalifragilisticexpialidocious.",
        rating: 5
      };
      expect.assertions(4);
      await expect(reviewsModel.create("1", newReview)).rejects.toMatchObject({
        message: "snackNotFound"
      });
      await expect(reviewsModel.create(-1, newReview)).rejects.toMatchObject({
        message: "snackNotFound"
      });
      await expect(reviewsModel.create(null, newReview)).rejects.toMatchObject({
        message: "snackNotFound"
      });
      await expect(reviewsModel.create(newReview)).rejects.toMatchObject({
        message: "snackNotFound"
      });
    });

    test("should throw an error if there is invalid or missing params in the body", async () => {
      const newReview = {
        title: "Yummy!",
        text: "This snack was supercalifragilisticexpialidocious.",
        rating: 5
      };
      await expect(reviewsModel.create(1, {})).rejects.toMatchObject({
        message: "aReviewFieldRequired"
      });
      await expect(
        reviewsModel.create(1, { title: "Yummy!" })
      ).rejects.toMatchObject({
        message: "aReviewFieldRequired"
      });
      await expect(
        reviewsModel.create(1, { titles: "Yummy!" })
      ).rejects.toMatchObject({
        message: "aReviewFieldRequired"
      });
      await expect(
        reviewsModel.create(1, { ...newReview, score: 10 })
      ).rejects.toMatchObject({
        message: "aReviewFieldRequired"
      });
    });
  });

  describe("update()", () => {
    test("update function should exist", () => {
      expect(reviewsModel.update).toBeDefined();
    });

    test("should update the review with given params", async () => {
      const response = await reviewsModel.update(1, {
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

      expect(response).toBeInstanceOf(Array);
      expect(response[0]).toBeInstanceOf(Object);
      expect(response[0]).toHaveProperty("id");
      expect(response[0]).toHaveProperty("title");
      expect(response[0]).toHaveProperty("text");
      expect(response[0]).toHaveProperty("rating");
      expect(response[0]).toHaveProperty("snack_id");
      expect(response[0]).toMatchObject(updatedReview);
      expect(response[0]).toMatchObject({
        id: expect.any(Number),
        title: expect.any(String),
        text: expect.any(String),
        rating: expect.any(Number),
        snack_id: expect.any(Number)
      });
      expect(response[0].title).toEqual("Yummy!");
      expect(response[0].rating).toEqual(5);
    });

    test("should throw an error if id is invalid or missing", async () => {
      const updateReview = {
        title: "Yummy!",
        rating: 5
      };

      expect.assertions(4);
      await expect(
        reviewsModel.update("1", updateReview)
      ).rejects.toMatchObject({
        message: "reviewNotFound"
      });
      await expect(reviewsModel.update(-1, updateReview)).rejects.toMatchObject(
        {
          message: "reviewNotFound"
        }
      );
      await expect(reviewsModel.update(updateReview)).rejects.toMatchObject({
        message: "reviewNotFound"
      });
      await expect(
        reviewsModel.update(null, updateReview)
      ).rejects.toMatchObject({ message: "reviewNotFound" });
    });

    test("should throw an error if there is invalid or missing params in the body", async () => {
      expect.assertions(3);

      await expect(reviewsModel.update(1, {})).rejects.toMatchObject({
        message: "aReviewFieldRequired"
      });
      await expect(
        reviewsModel.update(1, { titles: "Incredible!" })
      ).rejects.toMatchObject({
        message: "aReviewFieldRequired"
      });
      await expect(
        reviewsModel.update(1, {
          title: "Incredible!",
          text:
            "If it were a person I'd say to it: Is your name Dan Druff? You get into people's hair. I mean like, I'd say that you're funny but looks aren't everything.",
          rating: 1,
          yummy: 5
        })
      ).rejects.toMatchObject({
        message: "aReviewFieldRequired"
      });
    });
  });

  describe("destroy()", () => {
    test("destroy function should exists", () => {
      expect(reviewsModel.destroy).toBeDefined();
    });

    test("should delete a snack when given an id", async () => {
      const startLength = await reviewsModel.getSnackReviews(1);
      const response = await reviewsModel.destroy(1);
      const endLength = await reviewsModel.getSnackReviews(1);
      const delReview = {
        id: 1,
        title: "Incredible!",
        text:
          "If it were a person I'd say to it: Is your name Dan Druff? You get into people's hair. I mean like, I'd say that you're funny but looks aren't everything.",
        rating: 1,
        snack_id: 1
      };
      expect(endLength.length).toEqual(startLength.length - 1);
      expect(response[0]).toEqual(delReview);
      expect(response[0]).toMatchObject(delReview);
      expect(response[0]).toMatchObject({
        id: expect.any(Number),
        title: expect.any(String),
        text: expect.any(String),
        rating: expect.any(Number),
        snack_id: expect.any(Number)
      });
    });

    test("should throw an error if id is invalid or missing", async () => {
      expect.assertions(3);
      await expect(reviewsModel.destroy("two")).rejects.toMatchObject({
        message: "reviewNotFound"
      });
      await expect(reviewsModel.destroy(-1)).rejects.toMatchObject({
        message: "reviewNotFound"
      });
      await expect(reviewsModel.destroy()).rejects.toMatchObject({
        message: "reviewNotFound"
      });
    });
  });
});
