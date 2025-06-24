# Student Hub

**Student Hub** is a full-stack productivity web app built for students to manage their time, notes, resources, and tasks — all in one place.

## Tech Stack

| Layer     | Tech                                  |
| --------- | ------------------------------------- |
| Frontend  | React (Vite), Shadcn UI, Tailwind CSS |
| Backend   | Hono (Node.js) + Drizzle ORM          |
| Database  | PostgreSQL                            |
| Auth      | JWT                                   |
| Analytics | PostHog                               |
| Hosting   | GitHub Codespaces (Dev), Local        |

---

## Getting Started (in GitHub Codespaces or locally)

### 1. Clone the project and open in Codespaces

If you're using **GitHub Codespaces**, everything is preconfigured. Just open the repo in a Codespace and you're ready.

Otherwise, clone locally and continue below:

```bash
git clone https://github.com/your-username/student-hub.git
cd student-hub
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Set up environment variables

Copy the backend environment file:

```bash
cp backend/.env.example backend/.env
```

Then fill in the actual values:

```env
DATABASE_URL=postgresql://postgres:admin@localhost:5432/student_hub
JWT_SECRET=your_jwt_secret_here
POSTHOG_API_KEY=your_posthog_api_key_here
POSTHOG_HOST=https://app.posthog.com
```

---

### 4. Push Drizzle schema to the database (if needed)

```bash
cd backend
npm run db:push
```

---

### 5. Run the full stack (frontend + backend)

From the root:

```bash
npm run dev
```

- Frontend will start on [http://localhost:5173](http://localhost:5173)
- Backend (Hono API) will run on [http://localhost:8787](http://localhost:8787)
- PostgreSQL is expected to run on port `5432`

---

## Useful Scripts

### Root `package.json`

```json
"scripts": {
  "dev": "concurrently \"npm run dev --prefix frontend\" \"npm run dev --prefix backend\""
}
```

### Backend (`/backend/package.json`)

```json
"scripts": {
  "dev": "nodemon app.js",
  "db:push": "drizzle-kit push",
  "db:generate": "drizzle-kit generate"
}
```

### Frontend (`/frontend/package.json`)

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

---

## Project Structure

```
/
├── backend/              # Hono backend, Drizzle ORM
│   ├── drizzle/          # Drizzle schema & migrations
│   ├── db.js             # Main DB connection
│   ├── drizzle.config.js
│   ├── app.js            # Hono entrypoint
│   ├── controllers/
│   ├── routes/
│   └── uploads/
├── frontend/             # Vite + React app
│   ├── src/
│   └── vite.config.js
├── .devcontainer/        # GitHub Codespaces config
│   ├── devcontainer.json
│   └── docker-compose.yml
├── README.md             # ← You're here
├── package.json          # Root: combined dev script
```

---

## Ports Summary

| Service    | Port |
| ---------- | ---- |
| Frontend   | 5173 |
| Backend    | 8787 |
| PostgreSQL | 5432 |

---

## GitHub Codespaces

This project includes:

- `.devcontainer/devcontainer.json`: sets up Node.js, ports, Docker volume, extensions
- `postCreateCommand`: installs dependencies + sets up DB
- Dockerized Postgres via `docker-compose.yml`

No local setup required — just open in a Codespace and code.

---
