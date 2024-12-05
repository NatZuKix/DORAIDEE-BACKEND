import vine from '@vinejs/vine'

const schema = vine.object({ 
    poster: vine.string().maxLength(15) , // all the fields are required by default 
    comment: vine.string()
   }) 

   export const createCommentValidator = vine.compile(schema)