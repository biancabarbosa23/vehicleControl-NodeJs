const knex = require('../database')

module.exports = {
  async createVehicle(req, res) {
    try {
      const { id } = req.params
      const data = req.body
      const level = req.level

      console.log(id)
      console.log(level)

      const vehicle = await knex('Veiculos')
        .select('id')
        .where('placa', data.placa)

      if (vehicle.length > 0)
        return res.json({ error: 'Essa placa já foi cadastrada!' })

      const idVehicle = await knex('Veiculos').insert(data)

      let owner = {}

      if (level == 1) {
        owner = {
          id_veiculo: idVehicle[0],
          id_aluno: id,
        }
      } else if (level == 2) {
        owner = {
          id_veiculo: idVehicle[0],
          id_gestor: id,
        }
      }

      await knex('Proprietario_veiculo').insert(owner)

      return res.json({
        success: 'veículo cadastrado com sucesso.',
        idVehicle: idVehicle[0],
      })
    } catch (err) {
      console.log(err)
      return res.json({ error: 'Não foi possível cadastrar o veículo' })
    }
  },
  async getVehicles(req, res) {
    try {
      const id = req.id

      const vehicles = await knex('Veiculos AS v')
        .select(
          'v.id',
          'v.placa AS plate',
          'v.marca AS brand',
          'v.cor AS color',
          'v.tipo AS type',
          'v.modelo AS model'
        )
        .innerJoin('Proprietario_veiculo AS pv', 'pv.id_veiculo', 'v.id')
        .modify((queryBuilder) => {
          if (req.level == 1) queryBuilder.where('pv.id_aluno', id)
          else if (req.level == 2) queryBuilder.where('pv.id_gestor', id)
        })

      return res.json(vehicles)
    } catch (err) {
      console.log(err)
      return res.json({ error: 'Não foi possível listar os veículos' })
    }
  },
  async updateVehicle(req, res) {
    try {
      const { id } = req.params
      const data = req.body
      const level = req.level

      await knex('Veiculos').update(data).where('id', id)

      return res.json({
        success: 'veículo atualizado com sucesso.',
      })
    } catch (err) {
      console.log(err)
      return res.json({ error: 'Não foi possível atualizar o veículo' })
    }
  },
  async destroy(req, res) {
    try {
      const { id } = req.params

      await knex('Veiculos').del().where('id', id)

      return res.json({ success: 'Veículo excluído com sucesso' })
    } catch (err) {
      console.log(err)
      return res.json({ error: 'Não foi possível excluir o veículo' })
    }
  },
}
