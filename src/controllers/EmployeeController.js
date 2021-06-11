const knex = require('../database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const hash = require('../config/auth.json')
require('dotenv').config()

module.exports = {
  async create(req, res) {
    try {
      const { nome, email, cpf, funcao, senha } = req.body

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
        user: { ...dataUser, id: userId[0] },
        token: jwt.sign({ id: userId[0], level: 2 }, hash.secret, {
          expiresIn: '12h',
        }),
      })
    } catch (err) {
      console.log(err)
      return res.json({ error: 'Usuário não pode ser cadastrado' })
    }
  },
  async getEmployee(req, res) {
    try {
      const id = req.id

      const employee = await knex('Gestores')
        .select('nome', 'cpf', 'email', 'funcao')
        .where('id', id)

      return res.json({ employee: employee[0] })
    } catch (err) {
      console.log(err)
      return res.json({ error: 'Usuário não pode ser listado' })
    }
  },
  async update(req, res) {
    try {
      const id = req.id
      const newData = req.body

      await knex('Gestores').update(newData).where('id', id)

      return res.json({ success: 'Dados alterados com sucesso.' })
    } catch (err) {
      console.log(err)
      return res.json({ error: 'Usuário não pode ser cadastrado' })
    }
  },
}
