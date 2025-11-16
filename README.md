# Data Warehouse - DataBank v2

Application web complète pour la gestion de données d'entreprises et de contacts, avec une architecture moderne frontend/backend.

## 📋 Description

Data Warehouse est une plateforme de gestion de données qui permet de :
- Gérer des contacts et leurs informations personnelles
- Gérer des entreprises et leurs détails
- Importer des données depuis des fichiers CSV/Excel
- Filtrer et rechercher des données
- Visualiser des statistiques et tableaux de bord

## 🏗️ Architecture

Le projet est organisé en deux parties principales :

```
Data warehouse/
├── client/          # Frontend React avec Vite
└── server/          # Backend Express.js avec PostgreSQL
```

### Frontend (Client)
- **Framework** : React.js avec Vite
- **Styling** : CSS Modules, Material-UI (en cours de migration vers CSS pur)
- **Icons** : Lucide React
- **Routing** : React Router
- **Authentication** : Firebase

### Backend (Server)
- **Framework** : Express.js
- **Base de données** : PostgreSQL
- **Architecture** : MVC (Model-View-Controller)
- **ORM** : pg (PostgreSQL client natif)

## 🚀 Installation

### Prérequis
- Node.js (version 18+)
- npm (version 9+)
- PostgreSQL (version 12+)

### Installation du Frontend

```bash
cd client
npm install
```

### Installation du Backend

```bash
cd server
npm install
```

### Configuration

1. **Backend** : Créer un fichier `.env` dans `server/` :
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

2. **Frontend** : La configuration API est dans `client/src/config/api.js`

## 🏃 Démarrage

### Développement

**Backend** :
```bash
cd server
npm run dev
```

**Frontend** :
```bash
cd client
npm run dev
```

### Production

**Backend** :
```bash
cd server
npm start
```

**Frontend** :
```bash
cd client
npm run build
```

## 📡 API Endpoints

Voir [server/README.md](server/README.md) pour la documentation complète de l'API.

## 🎨 Fonctionnalités

- ✅ Gestion des contacts (CRUD)
- ✅ Gestion des entreprises
- ✅ Import de fichiers CSV/Excel
- ✅ Filtres et recherche avancée
- ✅ Tableaux de bord avec statistiques
- ✅ Authentification Firebase
- ✅ Design moderne et responsive

## 📦 Technologies

### Frontend
- React.js
- Vite
- React Router
- Firebase
- Material-UI (en migration vers CSS pur)
- Lucide React

### Backend
- Express.js
- PostgreSQL
- pg (PostgreSQL client)
- Helmet (sécurité)
- CORS
- express-rate-limit

## 📝 Structure du Projet

Voir [server/ARCHITECTURE.md](server/ARCHITECTURE.md) pour les détails de l'architecture backend.

## 🔒 Sécurité

- Validation des données
- Protection contre les injections SQL
- Headers de sécurité (Helmet)
- Rate limiting
- CORS configuré
- Gestion d'erreurs centralisée

## 📄 Licence

ISC

## 👤 Auteur

Data Warehouse Team

## 🌐 Déploiement

L'application est déployée sur : [databankv2.vercel.app](https://databankv2.vercel.app)
