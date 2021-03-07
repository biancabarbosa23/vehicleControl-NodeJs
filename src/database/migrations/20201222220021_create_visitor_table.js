exports.up = (knex) =>
  knex.schema.createTable('Visitantes', (table) => {
    table.increments('id').primary()
    table.string('nome', 100).notNullable()
    table.string('cpf', 11).unique().notNullable()

    table.timestamp('criado_em').defaultTo(knex.fn.now())
  })

exports.down = (knex) => knex.schema.dropTable('Visitantes')
