import type { HttpContext } from '@adonisjs/core/http'
import { createMovieValidator } from '#validators/create_movie'
import { updateMovieValidator } from '#validators/update_movie'
import Movie from '#models/movie'
import MovieRate from '../../Enums/MovieRate.js'
import Streaming from '../../Enums/Streaming.js'
import fs from 'fs'
import path from 'path'
import { DateTime } from 'luxon'
import Review from '#models/review'

export default class MoviesController {

    async getAllMovies({ response }: HttpContext) {
        // Fetch all movies and preload their ratings
        const movies = await Movie.query().preload('reviews')

        // Calculate the average rating for each movie
        const moviesWithAvgRatings = movies.map((movie) => {
            // Extract the ratings array from the preloaded relationship
            const Reviews = Array.isArray(movie.$preloaded.reviews) ? movie.$preloaded.reviews : []

            // Calculate the average rating
            const avgRating =
                Reviews.length > 0
                    ? Reviews.reduce((sum, review:any) => sum + review.star, 0) / Reviews.length
                    : 0

            // Remove the `ratings` property and add `avgRating`
            const { ratings, ...movieData } = movie.toJSON()

            // Return the movie object with the avgRating included, excluding ratings
            return {
                ...movieData,
                avgRating,
            }
        })

        response.ok(moviesWithAvgRatings)
    }

    async getMovieById({ params, response }: HttpContext) {
        const { id } = params
        try {
            // Fetch the movie by its ID and preload the reviews relationship
            const movie = await Movie.query()
                .where('id', id)
                .preload('reviews')
                .firstOrFail()

            // Extract the reviews array from the preloaded relationship
            const reviews = Array.isArray(movie.$preloaded.reviews) ? movie.$preloaded.reviews : []

            // Calculate the average rating
            const avgRating =
                reviews.length > 0
                    ? reviews.reduce((sum, review:any) => sum + review.star, 0) / reviews.length
                    : 0

            // Remove the `reviews` property and include the avgRating
            const { userId: _, ...movieData } = movie.toJSON()

            // Return the movie object with the avgRating included
            response.ok({
                ...movieData,
                avgRating,
            })
        } catch (error) {
            console.log(error)
            // If movie not found or some other error, respond with an error message
            response.notFound('Movie not found')
        }
    }

    async createNewMovie({ request, response, auth }: HttpContext) {
        const user = auth.getUserOrFail()
        console.log(user.role);
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
            const payload = await request.validateUsing(updateMovieValidator)

            movie.title = payload.title??movie.title
            movie.description = payload.description??movie.description
            movie.director = payload.director??movie.director
            movie.writer = payload.writer??movie.writer
            movie.cast = payload.cast??movie.cast
            movie.movierate =  payload.movierate !=null ? MovieRate[payload.movierate as keyof typeof MovieRate]:movie.movierate
            movie.streaming = payload.streaming != null ? Streaming[payload.streaming as keyof typeof Streaming]:movie.streaming
            movie.duration= payload.duration??movie.duration
            movie.trailer=payload.trailer??movie.trailer
            movie.updatedAt=DateTime.now()
            await movie.save()
            response.ok({ message: 'Movie updated successfully', movie })
        } catch (error) {
            console.log(error)
            response.notFound('Movie not found or update failed')
        }
    }


    async uploadPoster({ params, request, response }: HttpContext) {
        const { id } = params
        try {
            // Find the movie by ID
            const movie = await Movie.findOrFail(id)

            // Handle file upload using multipart (form-data)
            const poster = request.file('poster', {
                size: '25mb',  // max size of the file
                extnames: ['jpg', 'png', 'jpeg'], // accepted file types
            })

            // If no file was uploaded, return a bad request response
            if (!poster) {
                return response.badRequest('No poster file provided')
            }

            // Generate a unique filename using movie ID and current timestamp
            const fileName = `movie-${id}-${Date.now()}.${poster.extname}`

            // Define the file upload path inside the "storage/uploads" directory
            const filePath = path.join(__dirname, '../../storage/uploads')

            // Ensure the directory exists (create it if it doesn't)
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true })
            }

            try {
                // Move the uploaded file to the specified directory
                await poster.move(filePath, {
                    name: fileName,  // Use the unique filename
                    overwrite: true, // Prevent overwriting existing files
                })
            } catch (error) {
                console.error('File move error:', error)
                return response.internalServerError('File upload failed')
            }

            // Update the movie with the path to the uploaded poster
            movie.poster_url = `uploads/${fileName}`
            await movie.save()

            // Respond with the success message and the path to the uploaded poster
            response.ok({
                message: 'Poster uploaded successfully',
                poster: movie.poster_url
            })
        } catch (error) {
            console.log(error)
            response.internalServerError('Failed to upload poster')
        }
    }





}