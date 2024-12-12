import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('fullname').nullable()
      table.string('username', 254).notNullable().unique()
      table.string('password').notNullable()
      table.enum('role',['ADMIN','USER']).notNullable().defaultTo('USER')
      table.text('favoritecategories')
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}