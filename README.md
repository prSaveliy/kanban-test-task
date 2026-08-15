# Kanban Board

A full-stack Kanban board web application for creating, managing, and organizing tasks across visual workflow columns with drag-and-drop interaction.

**Live Demo**: [https://kanban-test-task-five.vercel.app/](https://kanban-test-task-five.vercel.app/)

---

## How to Run the Project

Before starting the application, configure your environment variables by duplicating the example `.env` file:

```bash
cp backend/.env.example backend/.env
```

### Running with Docker Compose

Make sure you have Docker installed on your machine.

```bash
docker compose up --build
```

Once running, the services will be available at:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000](http://localhost:3000)

---

## Technologies Used

**Frontend**:
- React
- TypeScript
- Vite
- React Router DOM
- TailwindCSS
- Zustand
- `@dnd-kit` (core, sortable, utilities)
- Axios
- Lucide React

**Backend**:
- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Zod
- Pino & pino-http

**Infrastructure**:
- Docker & Docker Compose
- Nginx (for serving the frontend production build)

---

## API Endpoints

The backend provides the following REST API endpoints:

- `POST /api/boards` – Create a new board (initialized with ToDo, In Progress, Done columns)
- `GET /api/boards/:boardId` – Retrieve a board by ID with its columns and cards
- `PATCH /api/boards/:boardId` – Update a board name
- `DELETE /api/boards/:boardId` – Delete a board by ID
- `POST /api/cards` – Create a new card in a column
- `PATCH /api/cards/:cardId` – Update card title and description
- `PATCH /api/cards/:cardId/move` – Move a card to another column or change its position
- `DELETE /api/cards/:cardId` – Delete a card by ID

---

## Database Description

The application uses a PostgreSQL database managed via Prisma ORM:

1. **Board** (`Board`)
   - `id`: String (UUID, Primary Key)
   - `name`: String
   - `createdAt`: DateTime
   - `updatedAt`: DateTime

2. **Column** (`Column`)
   - `id`: Int (Primary Key, Autoincrement)
   - `name`: String
   - `order`: Int
   - `boardId`: String (Foreign Key linking to `Board`, Cascade Delete)
   - `createdAt`: DateTime
   - `updatedAt`: DateTime

3. **Card** (`Card`)
   - `id`: Int (Primary Key, Autoincrement)
   - `title`: String
   - `description`: String
   - `position`: Int
   - `columnId`: Int (Foreign Key linking to `Column`, Cascade Delete)
   - `createdAt`: DateTime
   - `updatedAt`: DateTime

**Relationships**:
- One Board has many Columns (`1:N` with cascade deletion).
- One Column has many Cards (`1:N` with cascade deletion).

---

## How to Test

### Backend Testing

```bash
cd backend
cp .env.test.example .env.test
npm install
npx prisma generate
npm test
npm run lint
npm run build
npm run format:check
```

### Frontend Testing

```bash
cd frontend
npm install
npm run lint
npm run build
npm run format:check
```
