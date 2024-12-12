import User from '#models/user'
import Movie from '#models/movie'
import AdminBasePolicy from './adminBasePolicy.js'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
export default class MoviePolicy extends AdminBasePolicy {
  

  viewList(user: User): AuthorizerResponse { 
  return true
  } 
    
  create(user: User): AuthorizerResponse { 
  return false
  } 

  edit(user: User,movie: Movie): AuthorizerResponse { 
  return false
  } 
  
  update(user: User,movie: Movie): AuthorizerResponse { 
  return false
  } 
  
  delete(user: User,movie: Movie): AuthorizerResponse { 
  return false
  }
  
}