const { nanoid } = require("nanoid");

const ConnectPool = require("./ConnectPool");
const { mapDBSongsColumnsToModel } = require("../../utils");

const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongsService {
  constructor() {
    this._pool = ConnectPool();
  }

  async addSong({ title, year, genre, performer, duration = 0, albumId = '' }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId, createdAt, updatedAt]
    }

    const result = await this._pool.query(query).catch((err) => err);
    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add song.')
    }
    
    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query('SELECT id, title, performer FROM songs');
    return result.rows.map(mapDBSongsColumnsToModel);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Song not found.')
    }

    return result.rows.map(mapDBSongsColumnsToModel)[0];
  }

  async editSongById(id, { title, year, genre, performer, duration = 0, albumId = '' }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, updatedAt, id]
    }
    
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Failed to update song. Cannot find song.')
    }
  }

  async deleteSongById(id) {
    const result = await this._pool.query({
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id]
    })
    if (!result.rows.length) {
      throw new NotFoundError('Failed to delete song. Cannot find the song.')
    }
  }
}

module.exports = SongsService;