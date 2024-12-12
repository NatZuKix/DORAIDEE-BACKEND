import MoviesController from '#controllers/movies_controller' 
import router from '@adonisjs/core/services/router' 
import { middleware } from '#start/kernel'
import ReviewsController from '#controllers/reviews_controller'


router.group(()=>{ 
    router.group(()=>{ 
        router.get('/',[MoviesController,'getAllMovies']).as('movie.list')
        router.post('/',[MoviesController,'createNewMovie']).as('movie.create') 
        router.get('/:id',[MoviesController,'getMovieById']).as('movie.detail')
        router.post('/:id',[MoviesController,'uploadPoster']).as('movie.uploadPoster')
        router.delete('/:id',[MoviesController,'removeMovie']).as('movie.remove')
        router.put('/:id',[MoviesController,'editMovie']).as('movie.edit')
        router.get('/:id/poster',[MoviesController,'getPoster']).as('movie.poster')
        router.post('/:id/review',[ReviewsController,'createReview']).as('movie.createReview')
        router.delete('/:id/review',[ReviewsController,'removeReview']).as('movie.removeReview')
    }).prefix('/v1/movies') 
}).prefix('/api').use(middleware.auth()) 