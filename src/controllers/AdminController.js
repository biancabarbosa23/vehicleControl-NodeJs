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
      const { email, senha } = req.body

      const admin = await knex('Administrador').select().where('email', email)

      if (!(await bcrypt.compare(senha, admin[0].senha)))
        return res.json({ error: 'Senha Inválida!' })

      admin[0].senha = undefined

      return res.json({
        admin: admin[0],
        token: jwt.sign({ id: admin[0].id, level: 999 }, hash.secret, {
          expiresIn: '12h',
        }),
      })
    } catch (err) {
      console.log(err)
      return res.json({ error: 'Administrador não encontrado!' })
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body
      console.log(email)

      const admin = await knex('Administrador').select().where('email', email)

      if (admin.length === 0)
        return res.json({ error: 'Email não cadastrado!' })

      const token = crypto.randomBytes(20).toString('hex')
      const now = new Date()
      now.setHours(now.getHours() + 1)

      await knex('Administrador')
        .update({ senha_reset_token: token, senha_reset_expira: now })
        .where('email', email)

      const resetPasswordUrl = `${process.env.FRONT_URL}/admin/reset/${token}`
      const name = 'Administrador(a)'

      mailer.sendMail(
        {
          to: email,
          from: 'veiculos@fatecitu.com.br',
          subject: 'Recuperação de senha',
          template: 'forgotPassword',
          context: { resetPasswordUrl, name },
        },
        (err) => {
          if (err) {
            return res.json({ error: 'Erro ao enviar e-mail' })
          }

          return res.json({ success: 'E-mail enviado com sucesso' })
        }
      )
    } catch (err) {
      console.log(err)
      return res.json({ error: 'Erro ao tentar recuperar senha!' })
    }
  },

  async resetPassword(req, res) {
    try {
      const { token, senha, confirmarSenha } = req.body

      const admin = await knex('Administrador')
        .select('senha_reset_expira')
        .where('senha_reset_token', token)

      if (admin.length === 0)
        return res.json({ error: 'Token para alteração de senha inválido' })

      if (admin[0].senha_reset_expira < new Date())
        return res.json({
          error: 'Token não é mais válido! Solicite outro link',
        })

      if (senha !== confirmarSenha)
        return res.json({ error: 'A confirmação de senha esta incorreta' })

      const newPassword = bcrypt.hashSync(senha, 10)

      await knex('Administrador')
        .update('senha', newPassword)
        .where('senha_reset_token', token)

      await knex('Administrador')
        .update('senha_reset_token', null)
        .where('senha_reset_token', token)

      return res.json({ success: 'Senha alterada com sucesso' })
    } catch (err) {
      return res.json({ error: 'Erro ao tentar altera a senha!' })
    }
  },

  async isAuthenticated(req, res) {
    return res.json({ valid: true })
  },
}
