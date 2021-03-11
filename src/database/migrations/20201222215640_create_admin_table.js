exports.up = (knex) =>
  knex.schema.createTable('Administrador', (table) => {
    table.increments('id').primary()
    table.string('email', 100).unique().notNullable()
    table.string('senha', 255).notNullable()
    table.string('senha_reset_token')
    table.dateTime('senha_reset_expira')
  })

exports.down = (knex) => knex.schema.dropTable('Administrador')
