import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import Role from '../../Contract/Role.js'


export default class AdminBasePolicy extends BasePolicy {
    async before(user: User | null, action: string, ...params: any[]) {
        if (user?.role == Role.ADMIN) {
            return true
        }
    }
} 