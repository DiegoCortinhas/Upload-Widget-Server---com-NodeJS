import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { env } from "@/env";
import {serializerCompiler,validatorCompiler,hasZodFastifySchemaValidationErrors} from 'fastify-type-provider-zod'
import { uploadImageRoute } from "./routes/upload-image";


const server = fastify()
server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error,request,reply) =>{
    if(hasZodFastifySchemaValidationErrors(error)){
        return reply.status(400).send({
            message: 'Validation error.',
            issues: error.validation,
        })
    }
    
    //Enviar erro p/alguma ferramenta de observabilidade (Sentry/Datadog/Grafana/Otelemetry)

    console.error(error)
    return reply.status(500).send({message:'Internal server error.'})

})

server.register(fastifyCors, { origin: '*' })

console.log(env.DATABASE_URL)
server.register(uploadImageRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
    console.log('HTTP server is running')
})

