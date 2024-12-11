import vine from '@vinejs/vine'

const schema = vine.object({ 
    title: vine.string().maxLength(100).unique( async(db, value, field)=>{
        const movie = await db.from('movies')
                             .where('title',value)
                             .first()
        return !movie
    }), // all the fields are required by default 
    description: vine.string(),
    director:vine.string(),
    writer:vine.string(),
    movierate: vine.enum(['G', 'PG', 'PG-13', 'R', 'NC-17']),
    streaming:vine.enum(['cinema', 'netflix', 'disney+hostar', 'hbomax', 'amazonprime']),  
    cast:vine.string()
}) 

   export const createMovieValidator = vine.compile(schema)