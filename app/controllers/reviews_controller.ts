import Movie from '#models/movie'
import Review from '#models/review'
import { createReviewValidator } from '#validators/review'
import type { HttpContext } from '@adonisjs/core/http'

export default class ReviewsController {

    async createReview({ auth, params, request, response }: HttpContext) {
        const user = auth.getUserOrFail()
        const { id } = params

        try {

            await Movie.query().where('id', id).firstOrFail();

        } catch (error) {
            return response.notFound("Not found movie")
        }

        if (await Review.query().where('movieId', id).where('userId', user.id).first() != null)
            return response.conflict("You already reviewed this movie")

        try {

            const payload = await request.validateUsing(createReviewValidator)

            Review.create({ star: payload.star, comment: payload.comment, userId: user.id, movieId: id })
            return response.ok("Review created successfully")
        } catch (error) {
            return response.badRequest(error)
        }
    }

    async removeReview({ auth, params,response,bouncer }: HttpContext) {
        const user = auth.getUserOrFail()
        const { id } = params
        try {
            const review = await Review.query().where('movieId', id).where('userId', user.id).firstOrFail()
            await bouncer.with('ReviewPolicy').authorize('delete',review!)
            review.delete()
            return response.ok("Review has been removed successfully.")
        } catch (error) {
            return response.notFound("No have review")
        }
    }


}