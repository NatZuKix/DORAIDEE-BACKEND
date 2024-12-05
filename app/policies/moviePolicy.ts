import User from '#models/user'
import Movie from '#models/movie'
import AdminBasePolicy from './adminBasePolicy.js'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
export default class PostPolicy extends AdminBasePolicy {
  

 viewList(user: User): AuthorizerResponse { 
  return true
  } 
  
//   view(user: User,post: Post): AuthorizerResponse { 
//   return user.id == post.userId
//   } 
  
//   create(user: User): AuthorizerResponse { 
//   return true
//   } 
//   edit(user: User,post: Post): AuthorizerResponse { 
//   return user.id == post.userId
//   } 
  
//   update(user: User,post: Post): AuthorizerResponse { 
//   return user.id == post.userId 
//   } 
  
//   delete(user: User,post: Post): AuthorizerResponse { 
//   return user.id == post.userId 
//   }
  
}