/**
 * Service pour les opérations sur la géolocalisation
 */
const { pool } = require('../config/database');

class GeoService {
  /**
   * Créer une géolocalisation
   */
  async create(data, companyid, personalid, client) {
    const { address, city, state, country } = data;

    const query = `
      INSERT INTO geolocalisation (
        "geoid", "companyid", "address", "city", "state", "country"
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      personalid,
      companyid,
      address || '',
      city || '',
      state || '',
      country || '',
    ];

    const result = await client.query(query, values);
    return result.rows[0];
  }

  /**
   * Mettre à jour une géolocalisation
   */
  async update(companyid, data, client) {
    const { address, city, state, country } = data;

    const query = `
      UPDATE geolocalisation SET 
        address = $1, 
        city = $2, 
        state = $3, 
        country = $4 
      WHERE companyid = $5
      RETURNING *
    `;

    const values = [address, city, state, country, companyid];

    const result = await client.query(query, values);
    return result.rows[0];
  }

  /**
   * Supprimer une géolocalisation
   */
  async delete(companyid, client) {
    const result = await client.query(
      'DELETE FROM geolocalisation WHERE companyid = $1 RETURNING *',
      [companyid]
    );
    return result.rows[0];
  }

  /**
   * Récupérer toutes les géolocalisations
   */
  async getAll() {
    const result = await pool.query('SELECT * FROM geolocalisation');
    return result.rows;
  }
}

module.exports = new GeoService();

