import { DateTime } from 'luxon'
import { BaseModel, column,manyToMany,hasMany } from '@adonisjs/lucid/orm'
import Category from './category.js'
import Rating from './rating.js'
export default class Movie extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoUpdate: true })
  declare updatedAt: DateTime

  // Define many-to-many relationship
  @manyToMany(() => Category, {
    pivotTable: 'movie_categories',
  })
  declare categories: ManyToMany<typeof Category>

  // Define has-many relationship with Rating
  @hasMany(() => Rating)
  public ratings: HasMany<typeof Rating>
}