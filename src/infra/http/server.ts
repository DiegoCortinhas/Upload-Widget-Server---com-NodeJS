import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
    serializerCompiler,
    validatorCompiler,
    hasZodFastifySchemaValidationErrors, 
    } from 'fastify-type-provider-zod'
import { uploadImageRoute } from "./routes/upload-image";
import fastifyMultipart from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { transformSwaggerSchema } from "./routes/transform-swagger-schema";


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

server.register(fastifyMultipart)
server.register(fastifySwagger,{
    openapi:{
        info:{
            title: 'Upload Server',
            version: '1.0.0',
        },
    },
    transform: transformSwaggerSchema,
})

server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
})

//console.log(env.DATABASE_URL)
server.register(uploadImageRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
    console.log('HTTP server is running')
})

