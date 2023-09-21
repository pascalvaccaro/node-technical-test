import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";

import { Program, ProgramId, ProgramType } from "./schema";
import {
  PaginationQuerystring,
  PaginationQuerystringType,
  PaginationResult,
} from "../pagination/schema";

export default (fastify: FastifyInstance) => {
  fastify.get<{ Querystring: PaginationQuerystringType }>(
    "/api/program",
    {
      schema: {
        description: "See all the programs on a page (with pagination)",
        querystring: PaginationQuerystring,
        response: {
          200: PaginationResult(ProgramId),
        },
      },
    },
    async (request, reply) => {
      reply.send({ ...request.query, items, length: items.length });
    }
  );

  fastify.post<{ Body: ProgramType }>(
    "/api/program",
    {
      schema: {
        description: "Create a program",
        body: Program,
        response: {
          201: ProgramId,
        },
      },
    },
    async (request, reply) => {
      const program = request.body;

      reply.status(201).send(program);
    }
  );

  fastify.get<{ Params: { id: number } }>(
    "/api/program/:id",
    {
      schema: {
        description: "Get a program",
        params: Type.Object({ id: Type.Integer() }),
        response: {
          200: ProgramId,
        },
      },
    },
    async (request, reply) => {
      const { body: program, params } = request;
      const { id } = params;

      reply.status(200).send(program);
    }
  );

  fastify.put<{ Body: Partial<ProgramType>; Params: { id: number } }>(
    "/api/program/:id",
    {
      schema: {
        description: "Edit a program",
        params: Type.Object({ id: Type.Integer() }),
        body: Type.Partial(Program),
        response: {
          200: ProgramId,
        },
      },
    },
    async (request, reply) => {
      const { body: program, params } = request;
      const { id } = params;

      reply.status(200).send(program);
    }
  );

  fastify.delete<{ Params: { id: number } }>(
    "/api/program/:id",
    {
      schema: {
        description: "Delete a program",
        params: Type.Object({ id: Type.Integer() }),
        response: {
          204: { type: "null", description: "Successfully deleted program" },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      reply.status(204).send();
    }
  );
};
