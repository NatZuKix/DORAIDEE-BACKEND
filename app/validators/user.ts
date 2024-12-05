import vine from '@vinejs/vine'

const schema =  vine.object({
    username: vine.string().trim().minLength(6).maxLength(254).unique( async(db, value, field)=>{
        const user = await db.from('users')
                             .where('username',value)
                             .first()
        return !user
    }),
    password: vine.string().trim().minLength(6).confirmed()
})


   export const registerUserValidator = vine.compile(schema)