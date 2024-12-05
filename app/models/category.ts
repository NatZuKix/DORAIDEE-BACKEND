import { DateTime } from 'luxon'
import { BaseModel, column,manyToMany} from '@adonisjs/lucid/orm'
import Movie  from './movie.js'
export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoUpdate: true })
  declare updatedAt: DateTime

  // Define many-to-many relationship
  @manyToMany(() => Movie, {
    pivotTable: 'movie_categories',})
  declare movies: ManyToMany<typeof Movie>
}