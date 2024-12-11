import { DateTime } from 'luxon'
import { BaseModel, column,manyToMany,hasMany } from '@adonisjs/lucid/orm'
import Category from './category.js'
import Rating from './rating.js'
import Review from './review.js'
import MovieRate from '../../Enums/Movierate.js'
import Streaming from '../../Enums/Streaming.js'
export default class Movie extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string

   @column()
  declare director: string

  @column()
  declare writer: string

  @column()
  declare movierate: MovieRate

  @column()
  declare cast: string

  @column()
  declare duration: number

  @column()
  declare release_date: Date

  @column()
  declare streaming: Streaming

  @column()
  declare poster_url: string

  @column()
  declare trailer: string

  @column()
  declare userId: number



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
  declare ratings: HasMany<typeof Rating>

   // Define has-many relationship with Rating
   @hasMany(() => Review)
   declare reviews: HasMany<typeof Review>
 
}