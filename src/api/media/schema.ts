import { Static, Type } from "@sinclair/typebox";

export const Media = Type.Object({
  name: Type.Required(Type.String({ description: "The media name" })),
  file: Type.Required(Type.String({ description: "A URL for the audio file"})),
  duration: Type.Required(Type.Number({ description: "Duration of audio in ms"})),
  description: Type.Required(Type.String({ description: "A description of the media"})),
  position: Type.Integer({ minimum: 0, default: 0, description: "Position of media in its program" }),
  programId: Type.Integer({ nullable: true, description: "A media cannot be in more than one program" }),
});
export type MediaType = Static<typeof Media>;

export const MediaId = Type.Intersect([Type.Object({ id: Type.Integer() }), Media]);
export type MediaIdType= Static<typeof MediaId>;