const knex = require('../db')


function index() {
	
	return knex('snacks')
}

// function getSnackById(id) {
// 	return knex('snacks')
// 		.where({ id })
// 		.first()
// 		.then(snack => {
// 			if (!snack) throw new Error('snackNotFound')
// 			return snack
// 		})
// }

// function getFeatured() {
// 	return knex('snacks')
// 		.then(snacks => {
// 			const ids = [ generateRandomId(snacks.length), generateRandomId(snacks.length), generateRandomId(snacks.length) ]
// 			return [ snacks[ids[0]], snacks[ids[1]], snacks[ids[2]] ]
// 		})
// }

// function generateRandomId(snackQty) {
// 	return Math.ceil(Math.random() * snackQty)
// }

// function create(body){
// 	return knex('snacks')
// 		.insert( body )
// 		.returning(['*'])
// }

// function update(id, body) {
// 	return knex('snacks')
// 		.where({ id })
// 		.update( body )
// 		.returning(['*'])   
// }

// function destroy(id) {
// 	return knex('snacks')
// 		.where({ id })
// 		.del()
// 		.returning(['*'])
// }

module.exports = { index } 
// module.exports = { index, create, update, destroy, getSnackById, getFeatured } 