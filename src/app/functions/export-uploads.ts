import { z } from 'zod';
import { type Either, makeRight } from '@/shared/either';
import { schema } from '@/infra/db/schemas';
import { ilike } from 'drizzle-orm';
import { db, pg } from '@/infra/db';
import {stringify} from 'csv-stringify'
import { pipeline } from 'node:stream/promises';
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage';
import { PassThrough, Transform } from 'node:stream';

const exportUploadsInput = z.object({
    searchQuery: z.string().optional(),
})

type ExportUploadsInput = z.input<typeof exportUploadsInput>
type ExportUploadsOutput = {
    reportUrl:string
}

export async function exportUploads (input: ExportUploadsInput): Promise<Either<never,ExportUploadsOutput>>{
    const { searchQuery} = exportUploadsInput.parse(input)

    const {sql, params} = db
        .select({
            id: schema.uploads.id,
            name: schema.uploads.name,
            remoteUrl: schema.uploads.remoteUrl,
            createdAt: schema.uploads.createdAt,
        })
        .from(schema.uploads)
        .where(searchQuery ? ilike (schema.uploads.name, `%${searchQuery}%`) : undefined,)
        .toSQL()
        
        //drizzle não tem suporte a cursor. Drizzle faz tratativa da query para evitar sql injections
        const cursor = pg.unsafe(sql,params as string[]).cursor(2)
        
        /*for await (const rows of cursor){
            console.log(rows)
        }*/
        const csv = stringify({
            delimiter:',',
            header: true,
            columns:[
                {key: 'id', header:'ID'},
                {key: 'name', header:'Name'},
                {key: 'remote_url', header:'URL'},
                {key: 'created_at', header:'Uploaded at'}
                ],

        })

        const uploadToStorageStream = new PassThrough ()

        //pipeline READABLE/TRANSFORM/TRANSFORM/TRANSFORM => WRITABLE
        const convertToCSVPipeline = pipeline(
            cursor,
            new Transform ({
                objectMode: true,
                transform(chunks: unknown[], encoding, callback) {
                    for(const chunk of chunks){
                        this.push(chunk)
                    }
                    callback()
                },
            }),
            csv,
            //contentStream: stream de escrita no cloudfare R2
            uploadToStorageStream
        )


        const uploadToStorage = uploadFileToStorage ({
            contentType: 'text/csv',
            folder: 'downloads',
            fileName: `${new Date().toISOString()}-uploads.csv`,
            contentStream: uploadToStorageStream
        })
        

        const [{url}] = await Promise.all([uploadToStorage,convertToCSVPipeline])
        
    return makeRight({reportUrl: url})
}