const express = require('express')
const routes = express.Router()
const path = require('path')

const authMiddleware = require('./middleware/auth')

// Rotas de Autenticação

const AuthController = require('./controllers/AuthController')

routes.post('/user/login', AuthController.login)
routes.post('/user/forgot-password', AuthController.forgotPassword)
routes.post('/user/reset-password', AuthController.resetPassword)
routes.get('/user/authenticated', AuthController.isAuthenticated)

// Rotas do Administrador

const AdminController = require('./controllers/AdminController')

routes.post('/admin/login', AdminController.login)
routes.post('/admin/forgot-password', AdminController.forgotPassword)
routes.post('/admin/reset-password', AdminController.resetPassword)
routes.get('/admin/authenticated', AdminController.isAuthenticated)

// Rotas de Alunos

const StudentController = require('./controllers/StudentController')

routes.post('/student', StudentController.create)
routes.get('/student/:id', authMiddleware, StudentController.getStudent)
routes.put('/student/:id', authMiddleware, StudentController.update)

// Rotas de Gestores

const EmployeeController = require('./controllers/EmployeeController')

routes.post('/employee', EmployeeController.create)
routes.get('/employee/:id', authMiddleware, EmployeeController.getEmployee)
routes.put('/employee/:id', authMiddleware, EmployeeController.update)

// Rotas de Veículos

const VehicleController = require('./controllers/VehicleController')

routes.post('/vehicle/:id', authMiddleware, VehicleController.createVehicle)
routes.get('/control', authMiddleware, VehicleController.getControl)
routes.get('/vehicles', authMiddleware, VehicleController.getAll)
routes.get('/vehicles/:id', authMiddleware, VehicleController.getVehicles)
routes.put('/vehicle/:id', authMiddleware, VehicleController.updateVehicle)
routes.delete('/vehicle/:id', authMiddleware, VehicleController.destroy)

module.exports = routes
