import MoviesController from '#controllers/movies_controller' 
import router from '@adonisjs/core/services/router' 
import { middleware } from '#start/kernel'


router.group(()=>{ 
    router.group(()=>{ 
        router.get('/',[MoviesController,'getAllMovies']).as('movie.list')
        router.post('/',[MoviesController,'createNewMovie']).as('movie.create') 
        router.get('/:id',[MoviesController,'getMovieById']).as('movie.detail')
        router.post('/:id',[MoviesController,'uploadPoster']).as('movie.uploadposter')
        router.delete('/:id',[MoviesController,'removeMovie']).as('movie.remove')
        router.put('/:id',[MoviesController,'editMovie']).as('movie.edit')
        router.get('/:id/poster',[MoviesController,'getPoster']).as('movie.poster')
    }).prefix('/v1/movies') 
}).prefix('/api').use(middleware.auth()) 