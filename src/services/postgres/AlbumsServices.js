const { nanoid } = require("nanoid");

const ConnectPool = require("./ConnectPool");
const { mapDBAlbumsColumnsToModel } = require("../../utils");

const NotFoundError = require("../../exceptions/NotFoundError");
const InvariantError = require("../../exceptions/InvariantError");

class AlbumService {
  constructor() {
    this._pool = ConnectPool();
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'INSERT into albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt]
    }

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add album.')
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: `
      SELECT albums.id, albums.name, albums.year, songs.id
      FROM albums
      LEFT JOIN songs ON albums.id = songs.album_id
      WHERE albums.id = $1
      `,
      values: [id]
    }

    const result = await this._pool.query(query).catch((err) => err);
    console.log(result)
    if (!result.rows.length) {
      throw new NotFoundError('Album not found.');
    }

    return result.rows.map(mapDBAlbumsColumnsToModel)[0]; 
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id]
    }

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Failed to updat album. Cannot find album.')
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Failed to delete album. Cannot find album.')
    }
  }
}

module.exports = AlbumService;