# EcoFinds Marketplace Prototype

EcoFinds is a React + TypeScript prototype for a sustainable marketplace. It showcases Supabase-backed auth, product listings, and a lightweight cart experience, optimized for fast local development and simple deployment. 

 

---

## Live App
 This is a code bundle for EcoFinds Marketplace Prototype. The original project is available at  
https://eco---find.web.app/ 

---

## Tech Stack
- React + TypeScript (componentized UI and state) [web:73]
- Vite (fast dev server and build) [web:63]
- Supabase (auth and data) [web:73]
- CSS/Tailwind (responsive styling, if configured) [web:66]

---

## Features
- Authentication via Supabase (login/session) [web:73]
- Product browsing and basic cart flow (prototype) [web:73]
- Fast HMR development experience with Vite [web:63]
- Easy deploy to Firebase Hosting, Netlify, or Vercel [web:80][web:51][web:58]

---

## Getting Started

### Prerequisites
- Node.js LTS and npm installed:
node -v
npm -v

text
Use an LTS version for best compatibility. [web:66][web:67]

### Installation
1) Install dependencies:
npm i

text
2) Start the dev server:
npm run dev

text
Vite will print a local URL (typically http://localhost:5173). Open it in a browser. [web:63][web:65]

3) Build for production:
npm run build

text
Preview the production build locally:
npm run preview

text
This serves the dist folder for quick validation. [web:63][web:60]

---

## Environment Variables

Create a `.env` (or `.env.local`) at the project root to configure Supabase for the client:

VITE_SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR_PUBLIC_ANON_KEY"

text

Notes:
- Vite only exposes vars prefixed with `VITE_` to the client. [web:63]
- Do not expose service-role keys in client code. Use server-side only where applicable. [web:73]

---

## Project Structure (typical)
- `src/App.tsx` – application entry and top-level UI flow. [web:65]
- `src/components/*` – modular UI blocks (auth screen, product cards, etc.). [web:65]
- `src/utils/supabase/*` – Supabase client and helpers. [web:73]
- `src/styles/*` – global styles (and Tailwind config if used). [web:66]
- `index.html` – Vite entry HTML for the SPA root. [web:63]

---

## Deployment

### Firebase Hosting
Recommended if the current project already lives on Firebase.

1) Install Firebase CLI and login:
npm i -g firebase-tools
firebase login

text
2) Initialize (once):
firebase init hosting

Set "dist" as the public directory (for Vite), configure as single-page app (rewrite to /index.html)
text
3) Build and deploy:
npm run build
firebase deploy

text
Detailed steps in Firebase Hosting docs. [web:80]

### Netlify
- Build command: `npm run build`  
- Publish directory: `dist`  
- Drag-and-drop `dist` in Netlify dashboard or connect Git for CI/CD. [web:51][web:54]

### Vercel
- Import Git repo into Vercel.
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`  
Vercel’s Vite guide covers defaults and overrides. [web:58][web:61]

---

## Scripts
- `dev` – run the Vite dev server with HMR. [web:63]
- `build` – create an optimized production bundle. [web:63]
- `preview` – serve the production build locally. [web:63]

---

## Contributing
- Open issues with clear reproduction steps and environment info.
- Submit PRs following the existing code style.  
Consider adding a `CONTRIBUTING.md` for setup and review guidelines. [web:74]

---

## License
Choose and include a license suitable for your use (e.g., MIT). Add the `LICENSE` file at the repo root. Community examples can guide formatting. [web:78]

---

## References
- Vite – Getting Started: https://vite.dev/guide/ [web:63]
- Supabase – Quickstart & Auth: https://supabase.com/docs/guides/auth [web:73]
- Firebase Hosting – Quickstart: https://firebase.google.com/docs/hosting/quickstart [web:80]
- Netlify – Vite framework docs: https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/ [web:51]
- Vercel – Vite framework docs: https://vercel.com/docs/frameworks/frontend/vite [web:58]
