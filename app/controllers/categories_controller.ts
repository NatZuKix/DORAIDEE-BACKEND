import type { HttpContext } from '@adonisjs/core/http'
import Movie from '#models/movie'
import Categories from '../../Enums/Categories.js'
import Category from '#models/category'
import MovieCategory from '#models/movie_category'
export default class CategoriesController {
    async changeCategory({ auth, params, response, bouncer, request }: HttpContext) {
        const user = auth.getUserOrFail()
        await bouncer.with('MoviePolicy').authorize('create') 
        const { id } = params
        let movie = null
        try {

            movie = await Movie.query().where('id', id).firstOrFail();

        } catch (error) {
            return response.notFound("Not found movie")
        }

        const { data } = request.all()

        const categories = data

        const isArrayValid = categories.every((item: any) => Object.values(Categories).includes(item));

        if (!isArrayValid) {
            return response.badRequest({ message: 'Invalid categories' })
        }

        try {
            await MovieCategory.query().where('movieId',movie.id).delete()
            categories.forEach(async (catagory: any) => {

                let category = await Category.query().where('name', catagory).firstOrFail()

                MovieCategory.create({ movieId: movie.id, categoryId: category.id })

            });
            return response.ok("Update movie categories successfully.")
        } catch (error) {
            return response.internalServerError(error)
        }
    }
}
