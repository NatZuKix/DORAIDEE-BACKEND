import { DateTime } from 'luxon'
import { BaseModel, column,belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import Movie from './movie.js'

export default class Review extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare movieId: number

  @column()
  declare comment: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoUpdate: true })
  declare updatedAt: DateTime

  // Define relationship with User
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  // Define relationship with Movie
  @belongsTo(() => Movie)
  declare movie: BelongsTo<typeof Movie>
}