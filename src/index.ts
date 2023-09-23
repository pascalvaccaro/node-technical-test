import "dotenv/config";
import Fastify from "fastify";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastifyMysql } from "@fastify/mysql";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { fastifyMultipart } from "@fastify/multipart";
import { registerRoutes } from "./routes";
import { onFile } from "./utils/file";

const fastify = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

const start = async () => {
  try {
    fastify.register(fastifyMysql, {
      promise: true,
      connectionString: `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@localhost/${process.env.MYSQL_DATABASE}`,
    });
    fastify.register(fastifyMultipart, {
      attachFieldsToBody: "keyValues",
      onFile,
    });
    await fastify.register(fastifySwagger, {
      swagger: {
        info: {
          title: "Node Technical Test - Pascal Vaccaro",
          version: "0.1.0",
        },
      },
    });
    await fastify.register(fastifySwaggerUi);
    registerRoutes(fastify);
    await fastify.listen({ port: 8080 });
    await fastify.ready();
    fastify.swagger();
  } catch (error) {
    console.error(error);
    fastify.log.error(error);
  }
};

start();
