import MoviesController from '#controllers/movies_controller' 
import router from '@adonisjs/core/services/router' 
import { middleware } from '#start/kernel'


router.group(()=>{ 
    router.group(()=>{ 
        router.post('/',[MoviesController,'createNewMovie']).as('movie.create') 
    }).prefix('/v1/movies') 
}).prefix('/api').use(middleware.auth()) 