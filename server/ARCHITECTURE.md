# Architecture du Backend

## Vue d'ensemble

Le backend utilise une architecture **MVC (Model-View-Controller)** modulaire avec séparation claire des responsabilités.

## Structure des dossiers

```
server/
├── config/              # Configuration de l'application
│   ├── database.js      # Configuration PostgreSQL et pool de connexions
│   └── app.js           # Configuration Express (middlewares, CORS, sécurité)
│
├── controllers/         # Controllers (logique métier)
│   ├── clientController.js    # Gestion des clients
│   ├── companyController.js   # Gestion des entreprises
│   └── healthController.js    # Endpoints de santé
│
├── services/            # Services (opérations de base de données)
│   ├── clientService.js           # Service principal pour les clients
│   ├── personalDetailsService.js  # Opérations sur les détails personnels
│   ├── companyDetailsService.js   # Opérations sur les entreprises
│   ├── geoService.js              # Opérations sur la géolocalisation
│   ├── socialService.js           # Opérations sur les réseaux sociaux
│   └── revenueService.js          # Opérations sur les revenus
│
├── routes/              # Routes API
│   ├── clientRoutes.js   # Routes pour les clients
│   ├── companyRoutes.js  # Routes pour les entreprises
│   └── healthRoutes.js   # Routes de santé
│
├── middleware/          # Middlewares personnalisés
│   ├── errorHandler.js   # Gestion centralisée des erreurs
│   ├── notFound.js       # Gestion des routes 404
│   └── validator.js      # Validation des données
│
└── index.js             # Point d'entrée principal
```

## Flux de données

```
Requête HTTP
    ↓
Routes (routes/)
    ↓
Validation (middleware/validator.js)
    ↓
Controller (controllers/)
    ↓
Service (services/)
    ↓
Base de données PostgreSQL
    ↓
Réponse HTTP
```

## Principes de conception

### 1. **Séparation des responsabilités**
- **Routes** : Définition des endpoints et validation basique
- **Controllers** : Logique métier et orchestration
- **Services** : Opérations de base de données et logique métier complexe
- **Middleware** : Validation, gestion d'erreurs, logging

### 2. **Services réutilisables**
Chaque service est indépendant et peut être réutilisé dans différents controllers.

### 3. **Transactions**
Les opérations complexes utilisent des transactions PostgreSQL pour garantir l'intégrité des données.

### 4. **Gestion d'erreurs centralisée**
Toutes les erreurs sont gérées par le middleware `errorHandler.js`.

### 5. **Validation**
Les données sont validées avant traitement via le middleware `validator.js`.

## Exemple de flux complet

### Création d'un client

1. **Route** (`routes/clientRoutes.js`)
   ```javascript
   router.post('/clients', validateClient, clientController.createClient);
   ```

2. **Validation** (`middleware/validator.js`)
   - Vérifie que firstName, lastName, email, company sont présents

3. **Controller** (`controllers/clientController.js`)
   ```javascript
   async createClient(req, res, next) {
     const result = await clientService.createComplete(req.body);
     res.status(201).json(result);
   }
   ```

4. **Service** (`services/clientService.js`)
   - Crée les détails personnels
   - Crée les détails d'entreprise
   - Crée la géolocalisation (optionnel)
   - Crée les réseaux sociaux (optionnel)
   - Crée les revenus (optionnel)
   - Utilise une transaction pour garantir l'intégrité

5. **Services spécialisés**
   - `personalDetailsService.create()`
   - `companyDetailsService.create()`
   - `geoService.create()`
   - etc.

## Avantages

1. **Maintenabilité** : Code organisé et facile à comprendre
2. **Testabilité** : Services et controllers facilement testables
3. **Scalabilité** : Facile d'ajouter de nouvelles fonctionnalités
4. **Réutilisabilité** : Services réutilisables
5. **Sécurité** : Validation et gestion d'erreurs centralisées

## Prochaines améliorations possibles

1. **Modèles Sequelize** : Utiliser Sequelize ORM pour les modèles
2. **Tests unitaires** : Ajouter des tests pour les services et controllers
3. **Documentation API** : Swagger/OpenAPI
4. **Cache** : Redis pour le cache des requêtes fréquentes
5. **Logging avancé** : Winston ou Pino pour un logging structuré
6. **Authentification** : JWT pour sécuriser les endpoints

