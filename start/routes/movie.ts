import MoviesController from '#controllers/movies_controller' 
import router from '@adonisjs/core/services/router' 
import { middleware } from '#start/kernel'
import ReviewsController from '#controllers/reviews_controller'
import CategoriesController from '#controllers/categories_controller'


router.group(()=>{ 
    router.group(()=>{ 
        router.post('/',[MoviesController,'createNewMovie']).as('movie.create') 
        router.post('/:id',[MoviesController,'uploadPoster']).as('movie.uploadPoster')
        router.delete('/:id',[MoviesController,'removeMovie']).as('movie.remove')
        router.put('/:id',[MoviesController,'editMovie']).as('movie.edit')
        router.post('/:id/review',[ReviewsController,'createReview']).as('movie.createReview')
        router.delete('/:id/review',[ReviewsController,'removeReview']).as('movie.removeReview')
        router.post('/:id/categories',[CategoriesController,'changeCategory']).as('movie.category')
    }).prefix('/v1/movies') 
}).prefix('/api').use(middleware.auth()) 

router.group(()=>{ 
    router.group(()=>{ 
        router.get('/',[MoviesController,'getAllMovies']).as('movie.list')
        router.get('/:category',[MoviesController,'getMoviesBycategory']).as('movie.listbycategory')
        router.get('/:id',[MoviesController,'getMovieById']).as('movie.detail')
        router.get('/:id/poster',[MoviesController,'getPoster']).as('movie.poster')
    }).prefix('/v1/movies') 
}).prefix('/api')