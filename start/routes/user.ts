import UsersController from '#controllers/users_controller' 
import router from '@adonisjs/core/services/router' 
import { middleware } from '#start/kernel'
router.group(()=>{ 
    router.group(()=>{ 
        router.post('/login',[UsersController,'login']).as('users.login') 
        router.post('/register',[UsersController,'register']).as('users.register') 
    }).prefix('/v1/users') 
}).prefix('/api') 

router.group(()=>{ 
    router.group(()=>{ 
        router.get('/',[UsersController,'getAllUser']).as('users.all') 
        router.get('/:id',[UsersController,'getUserById']).as('users.details') 
        router.delete('/:id',[UsersController,'removeUser']).as('users.remove') 
        router.put('/:id/grant',[UsersController,'toggleAdmin']).as('users.grant') 
        router.put('/:id/categories',[UsersController,'modifyCategories']).as('users.categories') 
    }).prefix('/v1/users') 
}).prefix('/api').use(middleware.auth()) 