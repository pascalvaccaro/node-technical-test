import Fastify from "fastify";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastifyMysql } from "@fastify/mysql";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { registerRoutes } from "./routes";

const fastify = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

const start = async () => {
  try {
    fastify.register(fastifyMysql, {
      promise: true,
      connectionString: "mysql://server:staging@localhost/app",
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