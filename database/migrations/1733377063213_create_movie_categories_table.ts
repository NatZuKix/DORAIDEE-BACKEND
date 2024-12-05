import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'movie_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // Primary key
      table.integer('movie_id').unsigned().notNullable().references('id').inTable('movies').onDelete('CASCADE') // Reference to movies
      table.integer('category_id').unsigned().notNullable().references('id').inTable('categories').onDelete('CASCADE') // Reference to categories
      table.timestamp('created_at').defaultTo(this.now()) // Timestamp for creation
      table.timestamp('updated_at').defaultTo(this.now()) // Timestamp for last update

      table.unique(['movie_id', 'category_id']) // Ensure no duplicate relationships
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
