import { defineConfig } from '@adonisjs/auth'
import { sessionGuard, sessionUserProvider } from '@adonisjs/auth/session'
import type { InferAuthEvents, Authenticators } from '@adonisjs/auth/types'
import { JwtGuardUser, BaseJwtContent } from '@maximemrf/adonisjs-jwt/types'
import User from '#models/user'
import { jwtGuard } from '@maximemrf/adonisjs-jwt/jwt_config'
interface JwtContent extends BaseJwtContent {
  username: string
  fullname: string
  role:string
}

const authConfig = defineConfig({
  default: 'jwt',
  guards: {
    web: sessionGuard({
      useRememberMeTokens: false,
      provider: sessionUserProvider({
        model: () => import('#models/user')
      }),
    }),
    jwt: jwtGuard({
      tokenExpiresIn: '5h',
      useCookies: false,
      provider: sessionUserProvider({
        model: () => import('#models/user'),
      }),
      content: (user: JwtGuardUser<User>): JwtContent => ({
        userId: user.getId(),
        username: user.getOriginal().username,
        fullname: user.getOriginal().fullname,
        role:user.getOriginal().role
      }),
    }),
  },
})

export default authConfig

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module '@adonisjs/auth/types' {
  export interface Authenticators extends InferAuthenticators<typeof authConfig> { }
}
declare module '@adonisjs/core/types' {
  interface EventsList extends InferAuthEvents<Authenticators> { }
}