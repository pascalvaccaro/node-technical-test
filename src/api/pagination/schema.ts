import { Static, TSchema, Type } from "@sinclair/typebox";

export const PaginationQuerystring = Type.Object({
  cursor: Type.Integer({ default: 1, minimum: 1, description: "Page number" }),
  offset: Type.Integer({
    default: 20,
    minimum: 1,
    description: "Number of items by page",
  }),
});
export type PaginationQuerystringType = Static<typeof PaginationQuerystring>;

export const PaginationResult = (schema: TSchema) =>
  Type.Intersect([
    PaginationQuerystring,
    Type.Object({
      length: Type.Integer({
        minimum: 0,
        description: "Total number of items",
      }),
      items: Type.Array(schema, { description: "List of items" }),
    }),
  ]);
