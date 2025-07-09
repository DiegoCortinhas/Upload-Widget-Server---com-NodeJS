import { schema } from '@/infra/db/schemas'
import { db } from '@/infra/db'
import type {FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import {z} from 'zod'

export const uploadImageRoute: FastifyPluginAsyncZod = async server=>{
    server.post('/uploads',{
        schema:{
            summary: 'Upload an Image',
            consumes: ['multipart/form-data'],
            /*body: z.object({
                file: z.instanceof(File),
            }),*/
            response:{
                201: z.object({uploadId: z.string()}),
                409: z.object({message: z.string()}).describe('Upload already exists'),

            },
        },
    }, 
    async (request,reply)=>{
        const uploadedFile = await request.file({
            limits:{fileSize: 1024*1024*2 //2MB                
            }
        })
        /*await db.insert(schema.uploads).values({
            name: 'teste.jpg',
            remoteKey: 'teste.jpg',
            remoteUrl: 'http://hadhahdha.com'
        })*/
        console.log(uploadedFile)
        return reply.status(201).send({uploadId: 'teste'})
    })
}