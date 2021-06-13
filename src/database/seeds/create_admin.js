const bcrypt = require('bcrypt')

exports.seed = function (knex) {
  return knex('Administrador').insert([
    {
      email: '',
      senha: bcrypt.hashSync('', 10),
    },
  ])
}
