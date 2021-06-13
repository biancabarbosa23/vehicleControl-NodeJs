const knex = require('../database')

module.exports = {
  async getAll(req, res) {
    try {
      const { per_page, page } = req.query

      const vehicles = await knex('Veiculos AS v')
        .select(
          'v.*',
          knex.raw(
            `
            CASE WHEN pv.id_aluno is not null THEN 'aluno' ELSE 'gestor' END AS proprietario,
            CASE WHEN pv.id_aluno is not null THEN a.nome ELSE g.nome END AS nome,
            CASE WHEN pv.id_aluno is not null THEN a.cpf ELSE g.cpf END AS cpf,
            CASE WHEN pv.id_aluno is not null THEN a.email ELSE g.email END AS email,
            CASE WHEN pv.id_aluno is not null THEN a.curso ELSE '' END AS curso,
            CASE WHEN pv.id_aluno is not null THEN a.semestre ELSE '' END AS semestre,
            CASE WHEN pv.id_aluno is not null THEN a.periodo ELSE '' END AS periodo,
            CASE WHEN pv.id_gestor is not null THEN g.funcao ELSE '' END AS funcao
          `
          )
        )
        .limit(per_page)
        .offset((page - 1) * per_page)
        .innerJoin('Proprietario_veiculo AS pv', 'pv.id_veiculo', 'v.id')
        .leftJoin('Alunos as a', 'a.id', 'pv.id_aluno')
        .leftJoin('Gestores as g', 'g.id', 'pv.id_gestor')
        .modify((queryBuilder) => {
          if (req.query.search && req.query.search !== '') {
            queryBuilder.andWhere('v.placa', 'like', `%${req.query.search}%`)
            queryBuilder.orWhere('a.nome', 'like', `%${req.query.search}%`)
            queryBuilder.orWhere('g.nome', 'like', `%${req.query.search}%`)
          }
          if (req.query.order !== '')
            queryBuilder.orderBy(req.query.columnOrder, req.query.order)
        })

      const total = await knex('Veiculos AS v')
        .count('v.placa AS total')
        .innerJoin('Proprietario_Veiculo AS pv', 'pv.id_veiculo', 'v.id')
        .leftJoin('Alunos as a', 'a.id', 'pv.id_aluno')
        .leftJoin('Gestores as g', 'g.id', 'pv.id_gestor')
        .modify((queryBuilder) => {
          if (req.query.search && req.query.search !== '') {
            queryBuilder.andWhere('v.placa', 'like', `%${req.query.search}%`)
            queryBuilder.orWhere('a.nome', 'like', `%${req.query.search}%`)
            queryBuilder.orWhere('g.nome', 'like', `%${req.query.search}%`)
          }
          if (req.query.order !== '')
            queryBuilder.orderBy(req.query.columnOrder, req.query.order)
        })

      return res.json({ vehicles, total: total[0].total })
    } catch (err) {
      console.log(err)
      return res.json({ error: 'Não foi possível listar os veículos' })
    }
  },
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
  async getControl(req, res) {
    try {
      const { per_page, page } = req.query

      const control = await knex('Controle AS c')
        .select(
          'v.*',
          'c.*',
          knex.raw(
            `
            CASE WHEN pv.id_aluno is not null THEN 'aluno' ELSE 'gestor' END AS proprietario,
            CASE WHEN pv.id_aluno is not null THEN a.nome ELSE g.nome END AS nome,
            CASE WHEN pv.id_aluno is not null THEN a.cpf ELSE g.cpf END AS cpf,
            CASE WHEN pv.id_aluno is not null THEN a.email ELSE g.email END AS email,
            CASE WHEN pv.id_aluno is not null THEN a.curso ELSE '' END AS curso,
            CASE WHEN pv.id_aluno is not null THEN a.semestre ELSE '' END AS semestre,
            CASE WHEN pv.id_aluno is not null THEN a.periodo ELSE '' END AS periodo,
            CASE WHEN pv.id_gestor is not null THEN g.funcao ELSE '' END AS funcao
          `
          )
        )
        .limit(per_page)
        .offset((page - 1) * per_page)
        .innerJoin('Proprietario_veiculo AS pv', 'pv.id', 'c.id_prop_veiculo')
        .innerJoin('Veiculos AS v', 'v.id', 'pv.id_veiculo')
        .leftJoin('Alunos as a', 'a.id', 'pv.id_aluno')
        .leftJoin('Gestores as g', 'g.id', 'pv.id_gestor')
        .modify((queryBuilder) => {
          if (req.query.filters != '') {
            let date = new Date(req.query.filters)
            let date1 = date.setHours(date.getHours() + 1)
            let date2 = date.setHours(date.getHours() - 2)

            let more = new Date(date1)
            let less = new Date(date2)

            queryBuilder.whereBetween(`c.${req.query.filterField}`, [
              less,
              more,
            ])
          }
          if (req.query.search && req.query.search !== '') {
            queryBuilder.andWhere('v.placa', 'like', `%${req.query.search}%`)
            queryBuilder.orWhere('a.nome', 'like', `%${req.query.search}%`)
            queryBuilder.orWhere('g.nome', 'like', `%${req.query.search}%`)
          }
          if (req.query.order !== '')
            queryBuilder.orderBy(req.query.columnOrder, req.query.order)
        })

      const total = await knex('Controle AS c')
        .count('c.id AS total')
        .innerJoin('Proprietario_veiculo AS pv', 'pv.id', 'c.id_prop_veiculo')
        .innerJoin('Veiculos AS v', 'v.id', 'pv.id_veiculo')
        .leftJoin('Alunos as a', 'a.id', 'pv.id_aluno')
        .leftJoin('Gestores as g', 'g.id', 'pv.id_gestor')
        .modify((queryBuilder) => {
          if (req.query.filters != '') {
            let date = new Date(req.query.filters)
            let date1 = date.setHours(date.getHours() + 1)
            let date2 = date.setHours(date.getHours() - 2)

            let more = new Date(date1)
            let less = new Date(date2)

            queryBuilder.whereBetween(`c.${req.query.filterField}`, [
              less,
              more,
            ])
          }
          if (req.query.search && req.query.search !== '') {
            queryBuilder.andWhere('v.placa', 'like', `%${req.query.search}%`)
            queryBuilder.orWhere('a.nome', 'like', `%${req.query.search}%`)
            queryBuilder.orWhere('g.nome', 'like', `%${req.query.search}%`)
          }
          if (req.query.order !== '')
            queryBuilder.orderBy(req.query.columnOrder, req.query.order)
        })

      return res.json({ control, total: total[0].total })
    } catch (err) {
      console.log(err)
      return res.json({ error: 'Não foi possível listar os veículos' })
    }
  },
}
