import vine from '@vinejs/vine'

const schema = vine.object({ 
    title: vine.string() , // all the fields are required by default 
    body: vine.string()
   }) 

   export const createPostValidator = vine.compile(schema)