import { describe, expect, it } from 'vitest'
import { randomUUID } from 'node:crypto'
import { getUploads } from './get-uploads'
import { makeUpload } from '@/test/factories/make-uploads'
import { isRight, unwrapEither } from '@/shared/either'
import dayjs from 'dayjs'
import { exportUploads } from './export-uploads'

describe('export uploads', () => {
    
    it('should be able to export uploads', async() => {
        const namePattern = randomUUID()

        const upload1 = await makeUpload({name:`${namePattern}.webp`})
        const upload2 = await makeUpload({name:`${namePattern}.webp`})
        const upload3 = await makeUpload({name:`${namePattern}.webp`})
        const upload4 = await makeUpload({name:`${namePattern}.webp`})
        const upload5 = await makeUpload({name:`${namePattern}.webp`})

        const sut = await exportUploads({
            searchQuery:namePattern,
        })
        

        
    })

    
})