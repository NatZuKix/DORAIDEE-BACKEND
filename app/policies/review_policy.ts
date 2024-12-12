import Review from '#models/review'
import User from '#models/user'
import AdminBasePolicy from './adminBasePolicy.js'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
export default class ReviewPolicy extends AdminBasePolicy {


    delete(user: User, review: Review): AuthorizerResponse {
        return user.id == review.userId
    }

}