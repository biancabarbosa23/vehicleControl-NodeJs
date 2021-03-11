const express = require('express')
const routes = express.Router()
const path = require('path')

//const authMiddleware = require('./middleware/auth')

// Rotas de Autenticação

const AuthController = require('./controllers/AuthController')

routes.post('/user/login', AuthController.login)
routes.post('/user/forgot-password', AuthController.forgotPassword)
routes.post('/user/reset-password', AuthController.resetPassword)
routes.get('/user/authenticated', AuthController.isAuthenticated)

// Rotas de Alunos

const StudentController = require('./controllers/StudentController')

routes.post('/aluno/register', StudentController.create)

// Rotas de Gestores

const EmployeeController = require('./controllers/EmployeeController')

routes.post('/gestor/register', EmployeeController.create)

module.exports = routes
