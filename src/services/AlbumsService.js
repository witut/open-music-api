const { nanoid } = require('nanoid');
// const nanoid = (x) => (`12345678990${x}`);
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
    this._tableName = 'albums';
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: `INSERT INTO ${this._tableName} VALUES($1,$2,$3,$4,$5) RETURNING id`,
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);
    // console.log(result.rows);
    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query(`SELECT * FROM ${this._tableName}`);
    return result.rows;
  }

  async getAlbumById(id) {
    const query = {
      text: `SELECT * FROM ${this._tableName} WHERE id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    return result.rows[0];
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toDateString();

    const query = {
      text: `UPDATE ${this._tableName} SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id`,
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbaharui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: `DELETE FROM ${this._tableName} WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;
