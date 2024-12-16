import vine from '@vinejs/vine'

const schema = vine.object({ 
    title: vine.string().maxLength(100).nullable().optional(), // all the fields are required by default 
    description: vine.string().nullable().optional(),
    director:vine.string().nullable().optional(),
    writer:vine.string().nullable().optional(),
    movierate: vine.enum(['G', 'PG', 'PG-13', 'R', 'NC-17']).nullable().optional(),
    streaming:vine.enum(['cinema', 'netflix', 'disney+hostar', 'hbomax', 'amazonprime']).nullable().optional(),  
    cast:vine.string().nullable().optional(),
    duration:vine.number().nullable().optional(),
    trailer:vine.string().nullable().optional(),
    releaseDate:vine.date().nullable().optional()
}) 

   export const updateMovieValidator = vine.compile(schema)