exports.up = (knex) =>
  knex.schema.createTable('Veiculos', (table) => {
    table.increments('id').primary()
    table.string('placa', 7).unique().notNullable()
    table.string('marca', 30).notNullable()
    table.string('cor', 30).notNullable()
    table.string('modelo', 50).notNullable()
    table.string('tipo', 15).notNullable()

    table.timestamp('criado_em').defaultTo(knex.fn.now())
  })

exports.down = (knex) => knex.schema.dropTable('Veiculos')
