import { Static, Type } from "@sinclair/typebox";
import { MediaId } from "../media/schema";

export const Program = Type.Object({
  name: Type.String({ description: "The program name" }),
  cover: Type.String({ description: "A URL to the program cover" }),
  description: Type.String({ description: "A description for the program" }),
  medias: Type.Array(MediaId, {
    uniqueItems: true,
    description: "A program can contain between 0 and infinity medias",
  }),
});
export type ProgramType = Static<typeof Program>;

export const ProgramId = Type.Intersect([Type.Object({ id: Type.Integer() }), Program ]);
export type ProgramIdType = Static<typeof ProgramId>;