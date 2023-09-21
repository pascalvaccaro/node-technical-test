import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";
import { Media, MediaId, MediaType } from "./schema";
import {
  PaginationQuerystring,
  PaginationQuerystringType,
  PaginationResult,
} from "../pagination/schema";

export default (fastify: FastifyInstance) => {
  fastify.get<{ Querystring: PaginationQuerystringType }>(
    "/api/media",
    {
      schema: {
        description: "See all the medias on a page (with pagination)",
        querystring: PaginationQuerystring,
        response: {
          200: PaginationResult(MediaId),
        },
      },
    },
    async (request, reply) => {
      reply.send({ ...request.query, items, length: items.length });
    }
  );

  fastify.post<{ Body: MediaType }>(
    "/api/media",
    {
      schema: {
        description: "Create a media",
        body: Media,
        response: {
          201: MediaId,
        },
      },
    },
    async (request, reply) => {
      const media = request.body;

      reply.status(201).send(media);
    }
  );

  fastify.get<{ Params: { id: number } }>(
    "/api/media/:id",
    {
      schema: {
        description: "Get a media",
        params: Type.Object({ id: Type.Integer() }),
        response: {
          200: MediaId,
        },
      },
    },
    async (request, reply) => {
      const { body: media, params } = request;
      const { id } = params;

      reply.status(200).send(media);
    }
  );

  fastify.put<{ Body: Partial<MediaType>; Params: { id: number } }>(
    "/api/media/:id",
    {
      schema: {
        description: "Edit a media",
        params: Type.Object({ id: Type.Integer() }),
        body: Type.Partial(Media),
        response: {
          200: MediaId,
        },
      },
    },
    async (request, reply) => {
      const { body: media, params } = request;
      const { id } = params;

      reply.status(200).send(media);
    }
  );

  fastify.delete<{ Params: { id: number } }>(
    "/api/media/:id",
    {
      schema: {
        description: "Delete a media",
        params: Type.Object({ id: Type.Integer() }),
        response: {
          204: { type: "null", description: "Successfully deleted media" },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      reply.status(204).send();
    }
  );
};
