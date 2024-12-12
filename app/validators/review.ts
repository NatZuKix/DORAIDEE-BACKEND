import vine from '@vinejs/vine'

const schema = vine.object({ 
    star: vine.number().min(0).max(15) , // all the fields are required by default 
    comment: vine.string()
   }) 

   export const createReviewValidator = vine.compile(schema)