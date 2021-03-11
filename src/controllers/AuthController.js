const knex = require('../database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const mailer = require('../config/mailer')
const hash = require('../config/auth.json')
require('dotenv').config()

module.exports = {
  async login(req, res) {
    try {
      const { email, senha, type } = req.body

      let user

      if (type === 'aluno') {
        user = await knex('Alunos').select().where('email', email)
      } else if (type === 'gestor') {
        user = await knex('Gestores').select().where('email', email)
      }

      const test = await bcrypt.compare(senha, user[0].senha)

      if (!bcrypt.compareSync(senha, user[0].senha))
        return res.json({ error: 'Senha Inválida!' })

      user[0].senha = undefined

      return res.json({
        user: user[0],
        token: jwt.sign({ id: user[0].id }, hash.secret, {
          expiresIn: '12h',
        }),
      })
    } catch (err) {
      console.log(err)
      return res.json({ error: 'Usuário não encontrado!' })
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email, type } = req.body

      let user

      if (type === 'aluno')
        user = await knex('Alunos').select().where('email', email)
      else if (type === 'gestor')
        user = await knex('Gestores').select().where('email', email)

      if (user.length === 0) return res.json({ error: 'Email não cadastrado!' })

      const token = crypto.randomBytes(20).toString('hex')
      const now = new Date()
      now.setHours(now.getHours() + 1)

      if (type === 'aluno')
        await knex('Alunos')
          .update({ senha_reset_token: token, senha_reset_expira: now })
          .where('email', email)
      else if (type === 'gestor')
        await knex('Gestores')
          .update({ senha_reset_token: token, senha_reset_expira: now })
          .where('email', email)

      const resetPasswordUrl = `${process.env.FRONT_URL}/reset/${token}`
      const name = user[0].nome

      mailer.sendMail(
        {
          to: email,
          from: 'onlyfortest@tisorocaba.com.br',
          subject: 'Recuperação de senha',
          template: 'forgotPassword',
          context: { resetPasswordUrl, name },
        },
        (err) => {
          if (err) {
            console.log(err)
            return res.json({ error: 'Erro ao enviar e-mail' })
          }

          return res.json({ success: 'E-mail enviado com sucesso' })
        }
      )
    } catch (err) {
      return res.json({ error: 'Erro ao tentar recuperar senha!' })
    }
  },

  async resetPassword(req, res) {
    try {
      const { token, senha, confirmarSenha, type } = req.body

      let user

      if (type === 'aluno')
        user = await knex('Alunos')
          .select('senha_reset_expira')
          .where('senha_reset_token', token)
      else if (type === 'gestor')
        user = await knex('Gestores')
          .select('senha_reset_expira')
          .where('senha_reset_token', token)

      if (user.length === 0)
        return res.json({ error: 'Token para alteração de senha inválido' })

      if (user[0].password_reset_expires < new Date())
        return res.json({
          error: 'Token não é mais válido! Solicite outro link',
        })

      if (senha !== confirmarSenha)
        return res.json({ error: 'A confirmação de senha esta incorreta' })

      const newPassword = bcrypt.hashSync(senha, 10)

      if (type === 'aluno') {
        await knex('Alunos')
          .update('senha', newPassword)
          .where('senha_reset_token', token)

        await knex('Alunos')
          .update('senha_reset_token', null)
          .where('senha_reset_token', token)
      } else if (type === 'gestor') {
        await knex('Gestores')
          .update('senha', newPassword)
          .where('senha_reset_token', token)

        await knex('Gestores')
          .update('senha_reset_token', null)
          .where('senha_reset_token', token)
      }

      return res.json({ success: 'Senha alterada com sucesso' })
    } catch (err) {
      return res.json({ error: 'Erro ao tentar altera a senha!' })
    }
  },

  async isAuthenticated(req, res) {
    return res.json({ valid: true })
  },
}
