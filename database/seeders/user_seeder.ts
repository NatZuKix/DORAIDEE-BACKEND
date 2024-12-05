import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Role from '../../Contract/Role.js'
export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Insert 10 sample users

    await User.create({
      username: 'dooradee_admin1',
      fullName: 'dooradee_admin1',
      password: 'doraidee_1',
      role: Role.ADMIN
    })

  }
}