# Backend API Server - Architecture MVC

Serveur backend Express.js pour le projet Data Warehouse avec PostgreSQL, utilisant une architecture MVC (Model-View-Controller) modulaire et maintenable.

## 📋 Prérequis

- Node.js (version 18 ou supérieure)
- npm (version 9 ou supérieure)
- PostgreSQL (version 12 ou supérieure)

## 🏗️ Architecture

Le backend suit une architecture MVC (Model-View-Controller) avec séparation des responsabilités :

```
server/
├── config/           # Configuration (database, app)
├── controllers/      # Logique métier (controllers)
├── middleware/       # Middlewares personnalisés (validation, errors)
├── models/           # Modèles de données (à venir)
├── routes/           # Définition des routes
├── services/          # Services pour les opérations de base de données
└── index.js          # Point d'entrée principal
```

### Structure détaillée

#### **config/**
- `database.js` - Configuration et pool de connexions PostgreSQL
- `app.js` - Configuration Express (middlewares, CORS, sécurité)

#### **controllers/**
- `clientController.js` - Gestion des clients (CRUD)
- `companyController.js` - Gestion des entreprises
- `healthController.js` - Endpoints de santé

#### **services/**
- `clientService.js` - Service principal pour les opérations complètes sur les clients
- `personalDetailsService.js` - Opérations sur les détails personnels
- `companyDetailsService.js` - Opérations sur les entreprises
- `geoService.js` - Opérations sur la géolocalisation
- `socialService.js` - Opérations sur les réseaux sociaux
- `revenueService.js` - Opérations sur les revenus

#### **routes/**
- `clientRoutes.js` - Routes pour les clients
- `companyRoutes.js` - Routes pour les entreprises
- `healthRoutes.js` - Routes de santé

#### **middleware/**
- `errorHandler.js` - Gestion centralisée des erreurs
- `notFound.js` - Gestion des routes 404
- `validator.js` - Validation des données d'entrée

## 🚀 Installation

1. Installer les dépendances :
```bash
npm install
```

2. Créer un fichier `.env` à la racine du dossier `server` :
```bash
cp env.example .env
```

3. Configurer les variables d'environnement dans `.env` :
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password

FRONTEND_URL=http://localhost:5173
```

## 🏃 Démarrage

### Mode développement
```bash
npm run dev
```
Le serveur redémarre automatiquement lors des modifications (watch mode).

### Mode production
```bash
npm start
```

Le serveur sera disponible sur `http://localhost:3000`

## 📡 API Endpoints

### Santé du serveur
- **GET** `/api/health` - Vérifier que le serveur et la base de données fonctionnent

### Clients (Ressources)
- **GET** `/api/ressources` - Récupérer toutes les personnes
- **GET** `/api/ressources/all` - Récupérer toutes les ressources combinées (personnes, entreprises, géolocalisation, revenus, réseaux sociaux)
- **POST** `/api/clients` - Créer un nouveau client avec toutes ses données associées
- **PUT** `/api/ressources/update/:id` - Mettre à jour une ressource par ID
- **DELETE** `/api/ressources/delete/:id` - Supprimer une ressource par ID

### Entreprises
- **GET** `/api/companies` - Récupérer toutes les entreprises
- **GET** `/api/company/employees/:company` - Récupérer les employés d'une entreprise

## 🗄️ Structure de la base de données

Le backend utilise les tables PostgreSQL suivantes :

- `personaldetails` - Informations personnelles
- `companydetails` - Détails des entreprises
- `geolocalisation` - Localisation géographique
- `companyrevenue` - Revenus et financements des entreprises
- `socialdetails` - Informations des réseaux sociaux

## 🔧 Configuration

### Variables d'environnement

| Variable | Description | Par défaut |
|----------|-------------|------------|
| `PORT` | Port du serveur | `3000` |
| `NODE_ENV` | Environnement (development/production) | `development` |
| `DB_HOST` | Hôte PostgreSQL | `localhost` |
| `DB_PORT` | Port PostgreSQL | `5432` |
| `DB_NAME` | Nom de la base de données | - |
| `DB_USER` | Utilisateur PostgreSQL | - |
| `DB_PASSWORD` | Mot de passe PostgreSQL | - |
| `FRONTEND_URL` | URL du frontend pour CORS | `http://localhost:5173` |

### CORS

Le serveur est configuré pour accepter les requêtes depuis :
- `http://localhost:5173` (frontend Vite par défaut)
- `http://localhost:3000`
- `http://localhost:3001`
- L'URL spécifiée dans `FRONTEND_URL`
- En mode développement, toutes les origines sont autorisées

## 🛡️ Sécurité

- **Helmet** - Headers de sécurité configurés
- **CORS** - Configuration pour limiter les origines autorisées
- **Rate Limiting** - Limitation à 100 requêtes par IP toutes les 15 minutes
- **Validation** - Validation des données d'entrée
- **Protection SQL** - Requêtes paramétrées pour éviter les injections SQL
- **Gestion d'erreurs** - Messages génériques en production, détails en développement

## 📦 Dépendances principales

- **express** - Framework web
- **pg** - Client PostgreSQL
- **cors** - Middleware CORS
- **dotenv** - Gestion des variables d'environnement
- **helmet** - Sécurisation des headers HTTP
- **morgan** - Logging des requêtes HTTP
- **express-rate-limit** - Limitation du taux de requêtes

## 🎯 Avantages de la nouvelle architecture

1. **Séparation des responsabilités** - Code organisé par couches (routes, controllers, services)
2. **Maintenabilité** - Code modulaire et facile à maintenir
3. **Testabilité** - Services et controllers facilement testables
4. **Scalabilité** - Facile d'ajouter de nouvelles fonctionnalités
5. **Réutilisabilité** - Services réutilisables dans différents controllers
6. **Gestion d'erreurs** - Gestion centralisée et cohérente
7. **Validation** - Validation des données avant traitement
8. **Sécurité** - Middlewares de sécurité intégrés

## 🐛 Dépannage

### Erreur de connexion à la base de données

1. Vérifiez que PostgreSQL est en cours d'exécution
2. Vérifiez les variables d'environnement dans `.env`
3. Testez la connexion avec `psql` :
```bash
psql -h localhost -U your_user -d your_database
```

### Port déjà utilisé

Changez le port dans `.env` :
```env
PORT=3001
```

## 📝 Notes

- Le serveur utilise des transactions PostgreSQL pour garantir l'intégrité des données
- Les erreurs sont loggées avec des détails en développement
- Les requêtes sont loggées en mode développement
- Le pool de connexions PostgreSQL est configuré pour optimiser les performances
