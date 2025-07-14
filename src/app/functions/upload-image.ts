import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { Readable } from 'node:stream';
import {z} from 'zod';
import { InvalidFileFormat } from './errors/invalid-file-format';
import { makeLeft, makeRight } from '@/shared/either';
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage';

const uploadImageInput = z.object({
    fileName: z.string(),
    contentType: z.string(),
    contentStream: z.instanceof(Readable)
})

type UploadImageInput = z.input<typeof uploadImageInput>

const allowedMimeTypes = ['image/jpg','image/jpeg', 'image/png', 'image/webp']

export async function uploadImage (input: UploadImageInput): Promise<Either<InvalidFileFormat,{url:string}>>{
    const { contentStream, contentType,fileName} = uploadImageInput.parse(input)
    if(!allowedMimeTypes.includes(contentType)){
        return makeLeft(new InvalidFileFormat())
    }

    const {key, url} = await uploadFileToStorage ({
        folder:'images',
        fileName,
        contentType,
        contentStream,
    })
    //TODO:carregar a imagem para o cloudflare R2

    await db.insert(schema.uploads).values({
        name: fileName,
        remoteKey: key,
        remoteUrl: url,
    })
    return makeRight({url})
}