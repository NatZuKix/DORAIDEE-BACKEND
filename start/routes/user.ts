import UsersController from '#controllers/users_controller' 
import router from '@adonisjs/core/services/router' 
router.group(()=>{ 
    router.group(()=>{ 
        router.post('/login',[UsersController,'login']).as('users.login') 
        router.post('/register',[UsersController,'register']).as('users.register') 
        router.get('/:id',[UsersController,'getUser']).as('users.details') 
    }).prefix('/v1/users') 
}).prefix('/api') 