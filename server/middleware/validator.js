/**
 * Middleware de validation des données
 */

const validateClient = (req, res, next) => {
  const { firstName, lastName, email, company } = req.body;

  const errors = [];

  if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
    errors.push('Le champ "firstName" est requis et doit être une chaîne non vide');
  }

  if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
    errors.push('Le champ "lastName" est requis et doit être une chaîne non vide');
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    errors.push('Le champ "email" est requis et doit être une adresse email valide');
  }

  if (!company || typeof company !== 'object' || !company.company) {
    errors.push('Le champ "company" est requis et doit contenir au moins le nom de l\'entreprise');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Erreur de validation',
      details: errors
    });
  }

  next();
};

const validateUpdate = (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: 'L\'ID est requis pour la mise à jour'
    });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      error: 'Le corps de la requête ne peut pas être vide'
    });
  }

  next();
};

const validateDelete = (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: 'L\'ID est requis pour la suppression'
    });
  }

  next();
};

module.exports = {
  validateClient,
  validateUpdate,
  validateDelete
};

