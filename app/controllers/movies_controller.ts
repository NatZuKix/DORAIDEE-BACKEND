import type { HttpContext } from '@adonisjs/core/http'
import { createMovieValidator } from '#validators/create_movie'
import { updateMovieValidator } from '#validators/update_movie'
import Movie from '#models/movie'
import MovieRate from '../../Enums/MovieRate.js'
import Streaming from '../../Enums/Streaming.js'
import fs from 'fs'
import { dirname, join } from 'path';
import { DateTime } from 'luxon'
import { title } from 'process'
import { fileURLToPath } from 'url';
import Category from '#models/category'
import MovieCategory from '#models/movie_category'
import Review from '#models/review'



export default class MoviesController {
   

    async getAllMovies({ request, response }: HttpContext) {
        // Extract pagination parameters
        const page = request.input('page', 1); // Default to page 1
        const limit = request.input('limit', 10); // Default to 10 items per page

        // Fetch movies with pagination and preload their reviews
        const movies = await Movie.query()
            .preload('reviews', (queryReview) => {

                queryReview.select('star',)
            })
            .preload('categories', (queryCategory) => {
                queryCategory.select('name')
            })
            .paginate(page, limit);

        // Serialize movies for proper JSON response
        const serializedMovies = movies.toJSON();
        // console.log(movies);

        // Map and clean the movies data
        const moviesWithAvgRatings = serializedMovies.data.map((movie) => {
            // Extract reviews from the preloaded data
            const reviews = movie.reviews || [];

            // Calculate the average rating and review count
            const avgRating = reviews.length
                ? (reviews.reduce((sum: number, review: any) => sum + review.star, 0) / reviews.length).toFixed(1)
                : '0';
            const reviewCount = reviews.length;

            // Return a cleaned movie object
            return {
                id: movie.id,
                title: movie.title,
                description: movie.description,
                director: JSON.parse(movie.director), // Parse JSON fields
                writer: JSON.parse(movie.writer),
                cast: JSON.parse(movie.cast),
                movierate: movie.movierate,
                duration: movie.duration,
                release_date: movie.release_date,
                streaming: movie.streaming,
                poster_url: movie.poster_url,
                trailer: movie.trailer,
                categories: movie.categories,
                avgRating,
                reviewCount,
            };
        });

        // Send response with pagination meta and cleaned data
        response.ok({
            meta: {
                total: serializedMovies.meta.total,
                perPage: serializedMovies.meta.perPage,
                currentPage: serializedMovies.meta.currentPage,
                lastPage: serializedMovies.meta.lastPage,
            },
            data: moviesWithAvgRatings,
        });
    }

    async getMoviesBycategory({ request, response, params }: HttpContext) {
        const { category } = params;

        // Extract pagination parameters
        const page = request.input('page', 1); // Default to page 1
        const limit = request.input('limit', 10); // Default to 10 items per page

        let cateId: number = 0

        // Fetch category by name
        try {
            const categoryTarget = await Category.query().where('name', category).firstOrFail();
            cateId = categoryTarget.id;
        } catch (error) {
            return response.badRequest('Invalid category.');
        }

        try {
            const listMovie = await MovieCategory.query().where('categoryId', cateId)
            const movieIds = listMovie.map((item) => item.movieId);
            // Fetch movies belonging to the category with pagination
            const movies = await Movie.query()
                .whereIn('id', movieIds)
                .preload('reviews', (queryReview) => {
                    queryReview.select('star');
                })
                .preload('categories', (queryCategory) => {
                    queryCategory.select('name');
                })
                .paginate(page, limit);

            // Serialize movies for proper JSON response
            const serializedMovies = movies.toJSON();

            // Map and clean the movies data
            const moviesWithAvgRatings = serializedMovies.data.map((movie) => {
                // Extract reviews from the preloaded data
                const reviews = movie.reviews || [];

                // Calculate the average rating and review count
                const avgRating = reviews.length
                    ? (reviews.reduce((sum: number, review: any) => sum + review.star, 0) / reviews.length).toFixed(1)
                    : '0';
                const reviewCount = reviews.length;

                // Return a cleaned movie object
                return {
                    id: movie.id,
                    title: movie.title,
                    description: movie.description,
                    director: JSON.parse(movie.director), // Parse JSON fields
                    writer: JSON.parse(movie.writer),
                    cast: JSON.parse(movie.cast),
                    movierate: movie.movierate,
                    duration: movie.duration,
                    release_date: movie.release_date,
                    streaming: movie.streaming,
                    poster_url: movie.poster_url,
                    trailer: movie.trailer,
                    categories: movie.categories,
                    avgRating,
                    reviewCount,
                };
            });

            // Send response with pagination meta and cleaned data
            response.ok({
                meta: {
                    total: serializedMovies.meta.total,
                    perPage: serializedMovies.meta.perPage,
                    currentPage: serializedMovies.meta.currentPage,
                    lastPage: serializedMovies.meta.lastPage,
                },
                data: moviesWithAvgRatings,
            });
        } catch (error) {
            return response.internalServerError(error);
        }
    }

    async getMovieById({ params, response }: HttpContext) {
        const { id } = params
        try {
            // Fetch the movie by its ID and preload the reviews relationship
            const movie = await Movie.query()
                .where('id', id)
                .preload('reviews', (queryReview) => {

                    queryReview.preload('user', (queryUser) => {
                        queryUser.select("fullname")
                    }).select("userId", "star", "comment", "createdAt")
                }).preload('categories', (queryCategory) => {
                    queryCategory.select('name')
                })
                .firstOrFail()

            // Extract the reviews array from the preloaded relationship
            const reviews = Array.isArray(movie.$preloaded.reviews) ? movie.$preloaded.reviews : []

            // Calculate the average rating
            const avgRating = reviews.length
                ? (reviews.reduce((sum: number, review: any) => sum + review.star, 0) / reviews.length).toFixed(1)
                : '0';

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

    async createNewMovie({ request, response, auth, bouncer }: HttpContext) {
        const user = auth.getUserOrFail()
        await bouncer.with('MoviePolicy').authorize('create')
        try {
            const payload = await request.validateUsing(createMovieValidator)
            const movie = await Movie.create({
                title: payload.title,
                description: payload.description,
                director: payload.director,
                writer: payload.writer,
                cast: payload.cast,
                movierate: payload.movierate as keyof typeof MovieRate,
                streaming: payload.streaming as keyof typeof Streaming,
                poster_url: 'uploads/default.png',
                trailer: 'https://www.youtube.com/embed/MzEFeIRJ0eQ?si=ciq9rLwHoWUXv8-r'
            })            
            response.ok({ messages: "Movie createed successfully", movie: movie })
        } catch (error) {
            console.log(error);
            response.badRequest(error.messages)
        }
    }

    async removeMovie({ params, response, bouncer }: HttpContext) {
        const { id } = params
        await bouncer.with('MoviePolicy').authorize('create')
        try {
            Review.query().where('movieId',id).delete()
            MovieCategory.query().where('movieId',id).delete()
            const movie = await Movie.findOrFail(id)
            await movie.delete()
            response.ok({ message: 'Movie deleted successfully' })
        } catch (error) {
            console.log(error)
            response.notFound('Movie not found')
        }
    }

    // Edit a movie by ID
    async editMovie({ params, request, response, bouncer }: HttpContext) {
        const { id } = params
        await bouncer.with('MoviePolicy').authorize('create')
        let movie: any = null
        try {
            movie = await Movie.findOrFail(id)
        }
        catch {
            return response.notFound('Movie not found')
        }

        try {

            const payload = await request.validateUsing(updateMovieValidator)
            if (title) {
                const unique = await Movie.query().where('title', payload.title ?? '').first()
                if (unique && unique.id != id) {
                    return response.badRequest({ messages: "The title has already been taken", rule: "database.unique", field: "title" })
                }
            }

            movie.title = payload.title ?? movie.title
            movie.description = payload.description ?? movie.description
            movie.director = payload.director ?? movie.director
            movie.writer = payload.writer ?? movie.writer
            movie.cast = payload.cast ?? movie.cast
            movie.movierate = payload.movierate != null ? payload.movierate as keyof typeof MovieRate : movie.movierate
            movie.streaming = payload.streaming != null ? payload.streaming as keyof typeof Streaming : movie.streaming
            movie.duration = payload.duration ?? movie.duration
            movie.trailer = payload.trailer ?? movie.trailer
            movie.releaseDate = payload.releaseDate ?? movie.releaseDate
            movie.updatedAt = DateTime.now()
            await movie.save()
            response.ok({ message: 'Movie updated successfully', movie })
        } catch (error) {
            console.log(error)
            response.badRequest(error.messages)
        }
    }


    async uploadPoster({ params, request, response, bouncer }: HttpContext) {
        const { id } = params
        await bouncer.with('MoviePolicy').authorize('create')
        let movie: any = null
        try {
            movie = await Movie.findOrFail(id)
        }
        catch {
            return response.notFound('Movie not found')
        }

        try {
            // Find the movie by ID

            // Handle file upload using multipart (form-data)
            const poster = request.file('poster', {
                size: '25mb',  // max size of the file
                extnames: ['jpg', 'png', 'jpeg'], // accepted file types
            })

            // If no file was uploaded, return a bad request response
            if (!poster) {
                return response.badRequest('No poster file provided')
            }
            const fileExtension = poster.clientName.split('.').pop();
            // Generate a unique filename using movie ID and current timestamp
            const fileName = `movie-${id}.${fileExtension}`



            // กำหนดเส้นทางของไฟล์ปัจจุบัน
            const __filename = fileURLToPath(import.meta.url);

            // กำหนดไดเรกทอรีของไฟล์ปัจจุบัน
            const __dirname = dirname(__filename);

            // กำหนดเส้นทางอัปโหลดไฟล์
            const filePath = join(__dirname, '../../storage/uploads');

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

    async getPoster({ params, response }: HttpContext) {
        const { id } = params
        let movie: any = null
        try {
            movie = await Movie.findOrFail(id)
        }
        catch {
            return response.notFound('Movie not found')
        }
        try {


            // กำหนดเส้นทางของไฟล์ปัจจุบัน
            const __filename = fileURLToPath(import.meta.url);

            // กำหนดไดเรกทอรีของไฟล์ปัจจุบัน
            const __dirname = dirname(__filename);

            const filePath = join(__dirname, '../../storage/', movie.poster_url);

            // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
            if (fs.existsSync(filePath)) {
                return response.download(filePath);
            } else {
                return response.notFound('File not found');
            }
        } catch (error) {
            console.log(error)
            response.internalServerError('Failed to get poster')
        }
    }
}