# Don't Turn It In — Frontend Starter

A multi-role academic platform for AI-detection-aware assignment submission and monitoring.

## Tech Stack

| Layer       | Tech                             |
|-------------|----------------------------------|
| Framework   | React 18 + Vite                  |
| Language    | TypeScript (strict)              |
| Styling     | Tailwind CSS                     |
| HTTP client | Axios                            |
| Charts      | Recharts                         |
| State       | React state + Zustand (ready)    |
| Routing     | React Router v6                  |

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and set your API base URL
cp .env.example .env.local

# 3. Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Project Structure

```
src/
├── components/
│   ├── ui/               # Primitive UI pieces (badges, cards)
│   ├── layout/           # Navbar, Sidebar (global shell)
│   ├── dashboard/        # AssignmentCard, AnalyticsChart
│   ├── tables/           # SubmissionTable, StudentMonitorTable
│   └── forms/            # UploadForm (drag-and-drop)
├── pages/
│   ├── RoleSelection.tsx
│   ├── StudentDashboard.tsx
│   └── AdminDashboard.tsx
├── hooks/                # useAssignments, useSubmissions, useDashboard, useAnalytics
├── services/
│   └── api.ts            # All API calls — swap mock for real endpoints here
├── types/
│   └── index.ts          # All TypeScript types
├── constants/
│   └── index.ts
└── utils/
    └── index.ts
```

---

## Connecting a Real Backend

1. Set `VITE_API_URL=https://your-api.com/api/v1` in `.env.local`.
2. Open `src/services/api.ts`.
3. For each function, remove the `// MOCK` block and uncomment the `apiClient` line above it.
4. Done — no other file changes needed.

---

## Available Scripts

| Command           | Description                    |
|-------------------|--------------------------------|
| `npm run dev`     | Start Vite dev server          |
| `npm run build`   | TypeScript check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint`    | ESLint check                   |
| `npm run type-check` | TypeScript only (no emit)   |

---

## Roles & Routes

| Route      | Role          | Page                  |
|------------|---------------|-----------------------|
| `/`        | Any           | Role selection        |
| `/student` | Student       | Assignments + submit  |
| `/admin`   | Administrator | Dashboard + analytics |

---

## Environment Variables

| Variable        | Description                       | Default                          |
|-----------------|-----------------------------------|----------------------------------|
| `VITE_API_URL`  | Backend base URL                  | `http://localhost:8000/api/v1`   |
