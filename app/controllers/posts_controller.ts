import Post from '#models/post'
import { createPostValidator } from '#validators/post'
import type { HttpContext } from '@adonisjs/core/http'
export default class PostsController {
//   /** 
//      * Display a list of resource 
//      */
//   async index({ auth, response }: HttpContext) {
//     const user = auth.getUserOrFail()
//     const posts = await user.related('posts').query()
//     //response.status(200).send({posts: posts}) 
//     response.ok(posts)
//   }
//   /** 
//      * Handle form submission for the create action 
//      */
//   async store({ request,response,auth }: HttpContext) { 

//     const user = auth.getUserOrFail()
//     const payload = await request.validateUsing(createPostValidator)

//     const post = new Post()
//     post.userId = user.id
//     post.title = payload.title
//     post.body = payload.body

//     await post.save()
//     response.ok(post)
//   }
//   /** 
//      * Show individual record 
//      */
//   async show({ params, bouncer, response }: HttpContext) {
//     const id = params.id
//     const post = await Post.findOrFail(id)
//     await bouncer.with('PostPolicy').authorize('view', post)
//     response.ok(post)
//   }
//   /** 
//      * Handle form submission for the edit action 
//      */
//   async update({ bouncer, params, request, response }: HttpContext) {
//    const id = params.id
//    const post = await Post.findOrFail(id)

//    await bouncer.with('PostPolicy').authorize('update',post!)
//    const payload = await request.validateUsing(createPostValidator)

//    post!.title = payload.title
//    post!.body = payload.body

//    await post?.save()

//    response.redirect().toRoute('posts.home')
//  }

//  /**
//   * Delete record
//   */
//  async destroy({ bouncer, params, response }: HttpContext) {
//    const id = params.id
//    // const user = auth.getUserOrFail()
//    const post = await Post.findOrFail(id)
//    await bouncer.with('PostPolicy').authorize('delete',post!) 
//    await post?.delete()

//    response.redirect().toRoute('posts.home')
//  }
}