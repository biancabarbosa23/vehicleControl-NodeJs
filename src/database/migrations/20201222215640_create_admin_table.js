
exports.up = knex => knex.schema.createTable('admin', (table) => {
    table.increments('id').primary()
    table.string('email').unique().notNullable()
    table.string('password').notNullable()
    table.integer('level').notNullable()
    table.string('passwordResetToken')
    table.dateTime('passwordResetExpires')

    table.timestamp('created_at').defaultTo(knex.fn.now())
})

exports.down = knex => knex.schema.dropTable('admin')
