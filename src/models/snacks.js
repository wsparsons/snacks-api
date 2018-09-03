const knex = require("../db");

function index() {
  return knex("snacks");
}

function getSnackById(id) {
  if (!Number.isInteger(id) || id < 0 || !id)
    return Promise.reject(new Error("snackNotFound"));

  return knex("snacks")
    .where({ id })
    .first()
    .then(snack => {
      if (!snack) throw new Error("snackNotFound");
      return snack;
    });
}

function getFeatured() {
  return knex("snacks").then(snacks => {
    const ids = [
      generateRandomId(snacks.length),
      generateRandomId(snacks.length),
      generateRandomId(snacks.length)
    ];
    return [snacks[ids[0]], snacks[ids[1]], snacks[ids[2]]];
  });
}

function generateRandomId(snackQty) {
  return Math.ceil(Math.random() * snackQty);
}

function create(body) {
  const fields = ["name", "description", "price", "img", "is_perishable"];

  if (!fields.every(field => body[field]))
    return Promise.reject(new Error("aFieldRequired"));
  if (!Object.keys(body).every(field => fields.includes(field)))
    return Promise.reject(new Error("aFieldRequired"));

  return knex("snacks")
    .insert(body)
    .returning(["*"]);
}

function update(id, body) {
  const fields = ["name", "description", "price", "img", "is_perishable"];

  if (!Number.isInteger(id) || id < 0 || !id)
    return Promise.reject(new Error("snackNotFound"));
  if (Object.keys(body).length === 0)
    return Promise.reject(new Error("aFieldRequired"));
  if (!Object.keys(body).every(field => fields.includes(field)))
    return Promise.reject(new Error("aFieldRequired"));

  return knex("snacks")
    .where({ id })
    .update(body)
    .returning(["*"]);
}

function destroy(id) {
  if (!Number.isInteger(id) || id < 0 || !id)
    return Promise.reject(new Error("snackNotFound"));

  return knex("snacks")
    .where({ id })
    .del()
    .returning(["*"]);
}

module.exports = { index, create, update, destroy, getSnackById, getFeatured };
