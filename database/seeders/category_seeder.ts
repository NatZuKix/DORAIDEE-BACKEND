import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'

export default class CategorySeeder extends BaseSeeder {
  public async run () {
    // Define an array of categories to seed
    const categories = [
      { name: 'Action', description: 'Action-packed movies full of excitement' },
      { name: 'Comedy', description: 'Movies intended to make you laugh' },
      { name: 'Drama', description: 'Movies focused on realistic storytelling' },
      { name: 'Romance', description: 'Movies about love and relationships' },
      { name: 'Horror', description: 'Movies designed to scare or disturb' },
      { name: 'SciFi', description: 'Science fiction movies exploring futuristic themes' },
      { name: 'Fantasy', description: 'Movies based on magical or mythical worlds' },
      { name: 'Thriller', description: 'Movies that are intense and suspenseful' },
      { name: 'Documentary', description: 'Non-fictional movies that explore real-world events' },
    ]

    // Insert the categories into the database
    await Category.createMany(categories)
  }
}