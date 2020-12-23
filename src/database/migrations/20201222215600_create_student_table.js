
exports.up = knex => knex.schema.createTable('student', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('cpf').notNullable()
    table.string('email').unique().notNullable()
    table.string('course').notNullable()
    table.string('period').notNullable()
    table.string('semester').notNullable()
    table.string('password').notNullable()
    table.integer('level').notNullable()
    table.string('passwordResetToken')
    table.dateTime('passwordResetExpires')

    table.timestamp('created_at').defaultTo(knex.fn.now())
})

exports.down = knex => knex.schema.dropTable('student')
