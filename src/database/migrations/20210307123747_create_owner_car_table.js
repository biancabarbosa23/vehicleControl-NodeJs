exports.up = (knex) =>
  knex.schema.createTable('Proprietario_veiculo', (table) => {
    table.increments('id').primary()
    table.string('placa', 7).references('placa').inTable('Veiculos')
    table.integer('id_aluno').unsigned().references('id').inTable('Alunos')
    table.integer('id_gestor').unsigned().references('id').inTable('Gestores')
    table
      .integer('id_visitante')
      .unsigned()
      .references('id')
      .inTable('Visitantes')
  })

exports.down = (knex) => knex.schema.dropTable('Proprietario_veiculo')
