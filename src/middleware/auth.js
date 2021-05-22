const jwt = require('jsonwebtoken')
const auth = require('../config/auth.json')

//Validação do Token
module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization

  //existência do token
  if (!authHeader) return res.json({ error: 'Token não Informado!' })

  const partsToken = authHeader.split(' ')
  //Bearer + Hash

  if (!partsToken.length === 2) return res.json({ error: 'Erro no Token!' })

  const [part, token] = partsToken

  //verificação Bearer com RegExr
  if (!/^Bearer$/i.test(part))
    return res.json({ error: 'Erro de Formação no Token' })

  //Validação do token e usuário
  jwt.verify(token, auth.secret, function (err, codeUser) {
    if (err) return res.json({ error: 'Token invalido!' })

    req.id = codeUser.id
    req.level = codeUser.level

    return next()
  })
}
