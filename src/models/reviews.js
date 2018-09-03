const knex = require("../db");

function getSnackReviews(id) {
  if (!Number.isInteger(id) || id < 0 || !id)
    return Promise.reject(new Error("reviewNotFound"));

  return knex("reviews").where({ snack_id: id });
}

function getReviewById(id) {
  if (!Number.isInteger(id) || id < 0 || !id)
    return Promise.reject(new Error("reviewNotFound"));

  return knex("reviews")
    .where({ id })
    .first()
    .then(foundReview => {
      if (!foundReview) throw new Error("reviewNotFound");
      return foundReview;
    });
}

function create(snack_id, body) {
  const fields = ["title", "text", "rating"];

  if (!Number.isInteger(snack_id) || snack_id < 0 || !snack_id)
    return Promise.reject(new Error("snackNotFound"));
  if (!fields.every(field => body[field]))
    return Promise.reject(new Error("aReviewFieldRequired"));
  // if (Object.keys(body).length === 0)
  //   return Promise.reject(new Error("aReviewFieldRequired"));
  if (!Object.keys(body).every(field => fields.includes(field)))
    return Promise.reject(new Error("aReviewFieldRequired"));

  return knex("reviews")
    .insert({ snack_id, ...body })
    .returning(["*"]);
}

function update(snack_id, id, body) {
	return knex('reviews')
		.where({ id })
		.update( body )
		.returning(['*'])
}

// function destroy(snack_id, id) {
// 	return knex('reviews')
// 		.where({ snack_id, id })
// 		.del()
// 		.returning(['*'])
// }

module.exports = { getSnackReviews, getReviewById, create, update };
// module.exports = { getSnackReviews, getReviewById, create, update, destroy }
