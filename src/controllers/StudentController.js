const knex = require('../database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const hash = require('../config/auth.json')
require('dotenv').config()

module.exports = {
  async create(req, res) {
    try {
      let dataUser
      let userId

      const { nome, email, cpf, curso, periodo, semestre, senha } = req.body

      let aluno

      aluno = await knex('Alunos').select('id').where('email', email)
      if (aluno.length > 0)
        return res.json({ error: 'Esse E-mail já foi cadastrado!' })

      aluno = await knex('Alunos').select('id').where('cpf', cpf)
      if (aluno.length > 0)
        return res.json({ error: 'Esse CPF já foi cadastrado!' })

      dataUser = {
        nome,
        email,
        cpf,
        curso,
        periodo,
        semestre,
        senha: bcrypt.hashSync(senha, 10),
      }

      userId = await knex('Alunos').insert(dataUser)

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
