import { createWriteStream } from "node:fs";
import { promisify } from "node:util";
import { resolve } from "node:path";
import { pipeline } from "node:stream";
import { MultipartFile } from "@fastify/multipart";
import { FastifyRequest } from "fastify";

const pump = promisify(pipeline);

export async function onFile(this: FastifyRequest, part: MultipartFile) {
  const path = resolve(__dirname, "..", "..", "uploads", part.filename);
  // @hack: attach the filepath to the body as a Field
  (this.body as any).file = {
    type: "field",
    fieldname: "file",
    value: path
  };
  await pump(part.file, createWriteStream(path));
}
