import type { HttpContext } from '@adonisjs/core/http'
import { createMovieValidator } from '#validators/create_movie'
import Movie from '#models/movie'
import MovieRate from '../../Enums/Movierate.js'
import Streaming from '../../Enums/Streaming.js'



export default class MoviesController {

    async getAllMovies({ response }: HttpContext) {
        try {
            const movies = await Movie.query().preload('ratings') // Assuming the Movie model has a relation to 'user' for example
            response.ok(movies)
        } catch (error) {
            console.log(error)
            response.internalServerError('Failed to retrieve movies')
        }
    }

    async getMovieById({ params, response }: HttpContext) {
        const { id } = params
        try {
            // Find movie by ID and preload related categories, ratings, and reviews
            const movie = await Movie.query()
                .where('id', id)
                .preload('categories') // Assuming 'categories' is a defined relation in the Movie model
                .preload('ratings')   // Assuming 'ratings' is a defined relation in the Movie model
                .preload('reviews')   // Assuming 'reviews' is a defined relation in the Movie model
                .firstOrFail()        // Will throw an error if no movie with the given ID is found

            // Return the movie with its preloaded relationships
            response.ok(movie)
        } catch (error) {
            console.log(error)
            // If movie not found or some other error, respond with an error message
            response.notFound('Movie not found')
        }
    }

    async createNewMovie({ request, response, auth }: HttpContext) {
        const user = auth.getUserOrFail()
        try {
            const payload = await request.validateUsing(createMovieValidator)
            const movie = await Movie.create({
                title: payload.title,
                description: payload.description,
                director: payload.director,
                writer: payload.writer,
                cast: payload.cast,
                movierate: MovieRate[payload.movierate as keyof typeof MovieRate],
                streaming: Streaming[payload.streaming as keyof typeof Streaming],
                userId: user.id
            })
            response.ok(movie.id)
        } catch (error) {
            console.log(error);
            response.badRequest(error.messages)
        }
    }

    async removeMovie({ params, response }: HttpContext) {
        const { id } = params
        try {
            const movie = await Movie.findOrFail(id)
            await movie.delete()
            response.ok({ message: 'Movie deleted successfully' })
        } catch (error) {
            console.log(error)
            response.notFound('Movie not found')
        }
    }

    // Edit a movie by ID
    async editMovie({ params, request, response }: HttpContext) {
        const { id } = params
        try {
            const movie = await Movie.findOrFail(id)
            const payload = await request.validateUsing(createMovieValidator)

            movie.title = payload.title
            movie.description = payload.description
            movie.director = payload.director
            movie.writer = payload.writer
            movie.cast = payload.cast
            movie.movierate = MovieRate[payload.movierate as keyof typeof MovieRate]
            movie.streaming = Streaming[payload.streaming as keyof typeof Streaming]

            await movie.save()
            response.ok({ message: 'Movie updated successfully', movie })
        } catch (error) {
            console.log(error)
            response.notFound('Movie not found or update failed')
        }
    }

}