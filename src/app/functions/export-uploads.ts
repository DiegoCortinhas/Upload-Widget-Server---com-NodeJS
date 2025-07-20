import { z } from 'zod';
import { type Either, makeRight } from '@/shared/either';
import { schema } from '@/infra/db/schemas';
import { ilike } from 'drizzle-orm';
import { db, pg } from '@/infra/db';

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
        const csv = ''
        for await (const rows of cursor){
            console.log(rows)
        }
    return makeRight({reportUrl:''})
}