import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerUserValidator } from '#validators/user'
import Role from '../../Contract/Role.js'
import Categories from '../../Enums/Categories.js'


export default class UsersController {

    async login({ auth, request }: HttpContext) {
        const { username, password } = request.all()
        const user = await User.verifyCredentials(username, password)
        // to generate a token 
        return await auth.use('jwt').generate(user)
    }

    async register({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(registerUserValidator)
            const user = await User.create({ username: payload.username, password: payload.password ,fullname:payload.fullname})
            response.ok('The user is register successfully.')
        } catch (error) {
            response.badRequest(error.messages)
        }
    }

    async getUser({ request, response }: HttpContext) {
        try {
            // Assuming you are validating the request with the same schema for username
            const { userId } = request.all()

            // Find the user by username
            const user = await User.find(userId)

            if (!user) {
                return response.notFound({ message: 'User not found' })
            }
            return response.ok(user)

        } catch (error) {
            // Handle validation errors or any other unexpected errors
            return response.badRequest(error.messages)
        }
    }

    async removeUser({ request, response }: HttpContext) {
        try {
            // Assuming you are validating the request with the same schema for username
            const { userId } = request.all()

            // Find the user by username
            const user = await User.find(userId)

            if (!user) {
                return response.notFound({ message: 'User not found' })
            }

            // Delete the user from the database
            await user.delete()

            // Return a success response
            return response.ok({ message: 'User has been removed successfully.' })
        } catch (error) {
            // Handle validation errors or any other unexpected errors
            return response.badRequest(error.messages)
        }
    }

    async toggleAdmin({ request, response,params }: HttpContext) {
        try {
            // Get the userId and action (grant or remove) from the request
            const {  action } = request.all()
    
            // Validate the action (either 'grant' or 'remove')
            if (action !== 'grant' && action !== 'remove') {
                return response.badRequest({ message: 'Invalid action. Use "grant" or "remove".' })
            }
    
            // Find the user by userId
            const user = await User.find(params.id)
    
            if (!user) {
                return response.notFound({ message: 'User not found' })
            }
    
            // Grant or remove admin role based on the action
            if (action === 'grant') {
                user.role = Role.ADMIN
                return response.ok({ message: 'User granted admin access successfully.' })
            } else if (action === 'remove') {
                user.role = Role.USER
                return response.ok({ message: 'Admin access removed successfully.' })
            }
    
            // Save the updated user role to the database
            await user.save()
    
        } catch (error) {
            // Handle any unexpected errors
            return response.badRequest(error.messages)
        }
    }

    async modifyCategories({ request, response,params }: HttpContext){
        try {
            // Get the userId and action (grant or remove) from the request
            const {  data } = request.all()
    
            const catagories = JSON.parse(data);

            const isArrayValid = catagories.every((item:any) => Object.values(Categories).includes(item));

            if(!isArrayValid){
                return response.badRequest({ message: 'Invalid categories' })
            }
  
    
            // Find the user by userId
            const user = await User.find(params.id)
    
            if (!user) {
                return response.notFound({ message: 'User not found' })
            }
    
            user.fav_categories=data
    
            // Save the updated user role to the database
            await user.save()
    
        } catch (error) {
            // Handle any unexpected errors
            return response.badRequest(error.messages)
        }
    }

}