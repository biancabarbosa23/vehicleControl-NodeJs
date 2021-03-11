const knex = require('../database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const hash = require('../config/auth.json')
require('dotenv').config()

module.exports = {
  async create(req, res) {
    try {
      const { nome, email, cpf, funcao, senha } = req.body
      console.log(senha)

      let gestor

      gestor = await knex('Gestores').select('id').where('email', email)
      if (gestor.length > 0)
        return res.json({ error: 'Esse E-mail já foi cadastrado!' })

      gestor = await knex('Gestores').select('id').where('cpf', cpf)
      if (gestor.length > 0)
        return res.json({ error: 'Esse CPF já foi cadastrado!' })

      const dataUser = {
        nome,
        email,
        cpf,
        funcao,
        senha: bcrypt.hashSync(senha, 10),
      }

      const userId = await knex('Gestores').insert(dataUser)

      dataUser.senha = undefined

      return res.json({
        user: dataUser,
        token: jwt.sign({ id: userId[0] }, hash.secret, {
          expiresIn: '12h',
        }),
      })
    } catch (err) {
      console.log(err)
      return res.json({ error: 'Usuário não pode ser cadastrado' })
    }
  },
}
