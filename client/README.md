# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## 🚀 Démarrage rapide

### Prérequis
- Node.js (version 18 ou supérieure)
- npm (version 9 ou supérieure)

### Installation

1. Installer les dépendances :
```bash
npm install
```

### Développement

Démarrer le serveur de développement :
```bash
npm run dev
```

L'application sera accessible à l'adresse : `http://localhost:5173`

### Build pour la production

Créer une version optimisée pour la production :
```bash
npm run build
```

Les fichiers seront générés dans le dossier `dist/`.

### Prévisualiser le build de production

Prévisualiser la version de production :
```bash
npm run preview
```

### Linter

Vérifier le code avec ESLint :
```bash
npm run lint
```

## 📝 Notes

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
