import { FastifyInstance } from "fastify";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { MediaIdType, MediaType } from "./schema";
import { PaginationQuerystringType } from "../pagination/schema";

type MediaRow = MediaIdType & RowDataPacket;

export default (fastify: FastifyInstance) => {
  async function createMedia(payload: MediaType): Promise<MediaIdType> {
    const connection = await fastify.mysql.getConnection();
    try {
      const {
        description,
        duration,
        file,
        name,
        position = 0,
        programId,
      } = payload;
      const [result] = await connection.query<ResultSetHeader>(
        "INSERT INTO medias (name, file, description, duration, position, programId) VALUES (?, ?, ?, ?, ?, ?)",
        [name, file, description, duration, position, programId]
      );
      return getMediaById(result.insertId);
    } catch (err) {
      throw err;
    } finally {
      connection.release();
    }
  }

  async function findMedias(
    query: PaginationQuerystringType
  ): Promise<MediaIdType[]> {
    const connection = await fastify.mysql.getConnection();
    try {
      const { cursor: offset = 1, offset: limit = 20 } = query;
      const [rows] = await connection.query<MediaRow[]>(
        "SELECT * FROM medias LIMIT ? OFFSET ?",
        [limit, (offset - 1) * limit]
      );
      return rows;
    } catch (err) {
      throw err;
    } finally {
      connection.release();
    }
  }

  async function getMediaById(id: number): Promise<MediaIdType> {
    const connection = await fastify.mysql.getConnection();
    try {
      const [rows] = await connection.query<MediaRow[]>(
        "SELECT * FROM medias WHERE id = ?",
        [id]
      );
      return rows[0];
    } catch (err) {
      throw err;
    } finally {
      connection.release();
    }
  }

  async function updateMedia(
    id: number,
    payload: Partial<MediaType>
  ): Promise<MediaIdType> {
    const connection = await fastify.mysql.getConnection();
    try {
      const entries = Object.entries(payload).filter(([key]) => key !== "id");
      await connection.query(
        `UPDATE medias SET ${entries
          .map(([key]) => key + " = ?")
          .join(", ")} WHERE id = ?`,
        entries.map(([_, value]) => value).concat(id)
      );
      return getMediaById(id);
    } catch (err) {
      throw err;
    } finally {
      connection.release();
    }
  }

  async function deleteMedia(id: number): Promise<void> {
    const connection = await fastify.mysql.getConnection();
    try {
      await connection.query("DELETE FROM medias WHERE id = ?", [id]);
    } catch (err) {
      throw err;
    } finally {
      connection.release();
    }
  }

  return {
    createMedia,
    findMedias,
    getMediaById,
    updateMedia,
    deleteMedia,
  };
};
