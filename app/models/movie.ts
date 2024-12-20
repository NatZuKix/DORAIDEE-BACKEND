import { DateTime } from 'luxon'
import { BaseModel, column,manyToMany,hasMany } from '@adonisjs/lucid/orm'
import type { HasMany,ManyToMany} from '@adonisjs/lucid/types/relations'
import Category from './category.js'
import Review from './review.js'


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
  declare movierate:string

  @column()
  declare cast: string

  @column()
  declare duration: number

  @column()
  declare releaseDate: Date

  @column()
  declare streaming: string

  @column()
  declare poster_url: string

  @column()
  declare trailer: string




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
   @hasMany(() => Review)
   declare reviews: HasMany<typeof Review>
 
}