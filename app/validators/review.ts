import vine from '@vinejs/vine'

const schema = vine.object({ 
    star: vine.number().min(1).max(5) , // all the fields are required by default 
    comment: vine.string()
   }) 

   export const createReviewValidator = vine.compile(schema)