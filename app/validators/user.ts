import vine from '@vinejs/vine'

const schema =  vine.object({
    username: vine.string().minLength(6).unique( async(db, value, field)=>{
        const user = await db.from('users')
                             .where('username',value)
                             .first()
        return !user
    }),
    password: vine.string().minLength(6).confirmed()
})


   export const registerUserValidator = vine.compile(schema)