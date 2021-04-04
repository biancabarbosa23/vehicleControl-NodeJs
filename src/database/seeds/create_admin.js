const bcrypt = require('bcrypt')

exports.seed = function (knex) {
  return knex('Administrador').insert([
    {
      email: 'biancaa.barbosa@outlook.com',
      senha: bcrypt.hashSync('admin', 10),
    },
  ])
}
