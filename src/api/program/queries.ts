import { FastifyInstance } from "fastify";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { ProgramIdType, ProgramType } from "./schema";
import { PaginationQuerystringType } from "../pagination/schema";
import { MediaIdType } from "../media/schema";

type ProgramRow = ProgramIdType & RowDataPacket;
type MediaRow = MediaIdType & RowDataPacket;

export default (fastify: FastifyInstance) => {
  async function createProgram(payload: ProgramType): Promise<ProgramIdType> {
    const { name, cover, description, medias = [] } = payload;
    const connection = await fastify.mysql.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO programs (name, cover, description) VALUES (?, ?, ?)",
      [name, cover, description]
    );

    if (medias.length) {
      await connection.query<MediaRow[]>(
        "UPDATE medias SET programId = ? WHERE id IN (?)",
        [result.insertId, medias.join(", ")]
      );
    }
    connection.release();
    return getProgramById(result.insertId);
  }

  async function findPrograms(
    query: PaginationQuerystringType
  ): Promise<ProgramIdType[]> {
    const connection = await fastify.mysql.getConnection();
    try {
      const { cursor: offset = 1, offset: limit = 20 } = query;
      const [rows] = await connection.query<ProgramRow[]>(
        "SELECT * FROM programs LIMIT ? OFFSET ?",
        [limit, (offset - 1) * limit]
      );
      const [linked] = await connection.query<MediaRow[]>(
        `SELECT * FROM medias WHERE programId IN (${rows
          .map((p) => p.id)
          .join(", ")}) ORDER BY position ASC`
      );

      const programs = rows.map((row) => {
        const medias = linked.filter((media) => media.programId === row.id);
        return { ...row, medias };
      });
      return programs;
    } catch (err) {
      throw err;
    } finally {
      connection.release();
    }
  }

  async function getProgramById(id: number): Promise<ProgramIdType> {
    const connection = await fastify.mysql.getConnection();
    try {
      const [[program]] = await connection.query<ProgramRow[]>(
        "SELECT * FROM programs WHERE programs.id = ?",
        [id]
      );
      const [medias] = await connection.query<MediaRow[]>(
        "SELECT * FROM medias WHERE programId = ? ORDER BY position ASC",
        [id]
      );
      return { ...program, medias };
    } catch (err) {
      throw err;
    } finally {
      connection.release();
    }
  }

  async function updateProgram(
    id: number,
    payload: Partial<ProgramType>
  ): Promise<ProgramIdType> {
    const connection = await fastify.mysql.getConnection();
    try {
      const entries = Object.entries(payload).filter(
        ([key]) => key !== "id"
      ) as any[];
      await connection.query(
        "UPDATE programs SET " +
          entries.map(([key]) => key + " = ?").join(", ") +
          " WHERE id = ?",
        entries.map(([_, value]) => value).concat(id)
      );

      return getProgramById(id);
    } catch (err) {
      throw err;
    } finally {
      connection.release();
    }
  }

  async function deleteProgram(id: number): Promise<void> {
    const connection = await fastify.mysql.getConnection();
    try {
      await connection.query(
        "UPDATE medias SET programId = NULL WHERE programId = ?",
        [id]
      );
      await connection.query("DELETE FROM programs WHERE id = ?", [id]);
    } catch (err) {
      throw err;
    } finally {
      connection.release();
    }
  }

  return {
    createProgram,
    findPrograms,
    getProgramById,
    updateProgram,
    deleteProgram,
  };
};
