exports.up = (knex) =>
  knex.schema.createTable('Controle', (table) => {
    table.increments('id').primary()
    table
      .integer('id_prop_veiculo')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('Proprietario_veiculo')
    table.dateTime('entrada')
    table.dateTime('saida')
    table.string('imagem')
  })

exports.down = (knex) => knex.schema.dropTable('Controle')
