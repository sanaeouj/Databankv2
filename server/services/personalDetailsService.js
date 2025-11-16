/**
 * Service pour les opérations sur les détails personnels
 */
const { pool } = require('../config/database');

class PersonalDetailsService {
  /**
   * Récupérer toutes les personnes
   */
  async getAll() {
    const result = await pool.query('SELECT * FROM personaldetails ORDER BY personalid DESC');
    return result.rows;
  }

  /**
   * Récupérer une personne par ID
   */
  async getById(id) {
    const result = await pool.query('SELECT * FROM personaldetails WHERE personalid = $1', [id]);
    return result.rows[0];
  }

  /**
   * Créer une nouvelle personne
   */
  async create(data, client) {
    const {
      firstName,
      lastName,
      title,
      seniority,
      departments,
      mobilePhone,
      email,
      EmailStatus
    } = data;

    const query = `
      INSERT INTO personaldetails (
        "First Name", "Last Name", title, seniority, departments, 
        "mobilePhone", email, "EmailStatus" 
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      firstName || '',
      lastName || '',
      title || '',
      seniority || '',
      departments || '',
      mobilePhone || '',
      email || '',
      EmailStatus || '',
    ];

    const result = await client.query(query, values);
    return result.rows[0];
  }

  /**
   * Mettre à jour une personne
   */
  async update(id, data, client) {
    const {
      firstName,
      lastName,
      title,
      seniority,
      departments,
      mobilePhone,
      email,
      EmailStatus
    } = data;

    const query = `
      UPDATE personaldetails SET 
        "First Name" = $1, 
        "Last Name" = $2, 
        title = $3, 
        seniority = $4, 
        departments = $5, 
        "mobilePhone" = $6, 
        email = $7, 
        "EmailStatus" = $8 
      WHERE personalid = $9
      RETURNING *
    `;

    const values = [
      firstName,
      lastName,
      title,
      seniority,
      departments,
      mobilePhone,
      email,
      EmailStatus,
      id
    ];

    const result = await client.query(query, values);
    return result.rows[0];
  }

  /**
   * Supprimer une personne
   */
  async delete(id, client) {
    const result = await client.query(
      'DELETE FROM personaldetails WHERE personalid = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = new PersonalDetailsService();

