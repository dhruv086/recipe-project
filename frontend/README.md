# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Deployment on Render

## Backend
- Set environment variables in Render dashboard:
  - `PORT`
  - `MONGODB_URI`
  - `SPOONACULAR_API_KEY`
  - `FRONTEND_URL` (e.g., https://your-frontend.onrender.com)
- The backend will start with `npm start` (ensure the start script is present in package.json).

## Frontend
- Set environment variable in Render dashboard:
  - `VITE_API_URL` (e.g., https://your-backend.onrender.com)
- The frontend will build with `npm run build` and serve the static files.

## Notes
- Update CORS and API URLs as described in the codebase for production.
- Use `.env.example` files as templates for your environment variables.
