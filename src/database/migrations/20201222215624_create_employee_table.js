exports.up = (knex) =>
  knex.schema.createTable('Gestores', (table) => {
    table.increments('id').primary()
    table.string('nome', 100).notNullable()
    table.string('cpf', 11).unique().notNullable()
    table.string('email', 100).unique().notNullable()
    table.string('funcao', 50).notNullable()
    table.string('senha', 255).notNullable()
    table.string('senha_reset_token')
    table.dateTime('senha_reset_expira')

    table.timestamp('criado_em').defaultTo(knex.fn.now())
  })

exports.down = (knex) => knex.schema.dropTable('Gestores')
