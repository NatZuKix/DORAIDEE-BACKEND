import User from '#models/user'
import AdminBasePolicy from './adminBasePolicy.js'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
export default class UserPolicy extends AdminBasePolicy {

    list(user: User): AuthorizerResponse {
        return false
    }

    detail(user: User,targetUser:User): AuthorizerResponse {
        return user.id == targetUser.id
    }
    

    grant(user: User): AuthorizerResponse {
        return false
    }

    edit(user: User, targetUser: User): AuthorizerResponse {
        return user.id == targetUser.id
    }

    delete(user: User, targetUser: User): AuthorizerResponse {
        return user.id == targetUser.id
    }

}