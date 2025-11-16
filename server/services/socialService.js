/**
 * Service pour les opérations sur les réseaux sociaux
 */
const { pool } = require('../config/database');

class SocialService {
  /**
   * Créer des détails sociaux
   */
  async create(data, companyid, client) {
    const { linkedinUrl, facebookUrl, twitterUrl } = data;

    const query = `
      INSERT INTO socialdetails (
        "companyid", "Company Linkedin Url", "Facebook Url", "Twitter Url"
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [
      companyid,
      linkedinUrl || '',
      facebookUrl || '',
      twitterUrl || '',
    ];

    const result = await client.query(query, values);
    return result.rows[0];
  }

  /**
   * Mettre à jour des détails sociaux
   */
  async update(companyid, data, client) {
    const { linkedinUrl, facebookUrl, twitterUrl } = data;

    const query = `
      UPDATE socialdetails SET 
        "Company Linkedin Url" = $1, 
        "Facebook Url" = $2, 
        "Twitter Url" = $3 
      WHERE companyid = $4
      RETURNING *
    `;

    const values = [linkedinUrl, facebookUrl, twitterUrl, companyid];

    const result = await client.query(query, values);
    return result.rows[0];
  }

  /**
   * Supprimer des détails sociaux
   */
  async delete(companyid, client) {
    const result = await client.query(
      'DELETE FROM socialdetails WHERE companyid = $1 RETURNING *',
      [companyid]
    );
    return result.rows[0];
  }

  /**
   * Récupérer tous les détails sociaux
   */
  async getAll() {
    const result = await pool.query('SELECT * FROM socialdetails');
    return result.rows;
  }
}

module.exports = new SocialService();

