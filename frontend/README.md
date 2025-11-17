# MediConnect Frontend

This Vite + React project powers the MediConnect UI.

## Local Development

```bash
cd frontend
npm install
cp .env.example .env           # update API base URL if needed
npm run dev
```

The app reads its backend URL from `VITE_API_BASE_URL`. For local work, set it to your Spring Boot server (e.g. `http://localhost:8081`). The build script automatically strips trailing slashes.

## Production Build

```bash
npm run build
npm run preview   # optional smoke test
```

Artifacts are emitted to `dist/` and can be served by any static host.

## Deploying on Vercel

Vercel treats the `frontend` folder as the project root:

1. Import the repository into Vercel, and set the Root Directory to `frontend`.
2. Build command: `npm run build`
3. Install command: `npm install`
4. Output directory: `dist`
5. Add the `VITE_API_BASE_URL` environment variable under **Project Settings → Environment Variables** for both Preview and Production. Point it at your deployed backend (e.g. `https://api.mediconnect.com`).
6. Redeploy to pick up backend URL changes.

Make sure your backend's CORS configuration allows requests from the generated Vercel domain and that HTTPS is enforced so cookies/JWTs can be sent securely.
