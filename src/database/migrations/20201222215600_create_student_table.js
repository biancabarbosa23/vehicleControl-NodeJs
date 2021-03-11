exports.up = (knex) =>
  knex.schema.createTable('Alunos', (table) => {
    table.increments('id').primary()
    table.string('nome', 100).notNullable()
    table.string('cpf', 11).unique().notNullable()
    table.string('email', 100).unique().notNullable()
    table.string('curso', 50).notNullable()
    table.string('periodo', 5).notNullable()
    table.string('semestre', 10).notNullable()
    table.string('senha', 225).notNullable()
    table.string('senha_reset_token')
    table.dateTime('senha_reset_expira')

    table.timestamp('criado_em').defaultTo(knex.fn.now())
  })

exports.down = (knex) => knex.schema.dropTable('Alunos')
