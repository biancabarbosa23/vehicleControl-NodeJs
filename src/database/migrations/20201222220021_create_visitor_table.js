
exports.up = knex => knex.schema.createTable('visitor', (table) => {
    table.string('plate').primary()
    table.string('brand').notNullable()
    table.string('color').notNullable()
    table.string('model').notNullable()
    table.string('type').notNullable()
    table.integer('idOwner').notNullable()

    table.timestamp('created_at').defaultTo(knex.fn.now())
})

exports.down = knex => knex.schema.dropTable('visitor')