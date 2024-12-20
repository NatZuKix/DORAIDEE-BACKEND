import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'movies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title', 100).notNullable()
      table.text('description')
      table.text('director')
      table.text('writer')
      table.enum('movierate', ['G', 'PG', 'PG-13', 'R', 'NC-17']).defaultTo('PG')
      table.text('cast') 
      table.integer('duration').unsigned().comment('Duration in minutes') 
      table.date('release_date')
      table.enum('streaming', ['cinema', 'netflix', 'disney+hostar', 'hbomax', 'amazonprime']).defaultTo('cinema') 
      table.string('poster_url')
      table.text('trailer')
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
