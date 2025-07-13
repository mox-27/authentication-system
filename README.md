# 🛡️ Auth API

A robust authentication API built with **Node.js**, **Express**, and **Prisma ORM**. This project provides secure user authentication, authorization, and admin management features, following modern best practices and scalable architecture.

---

## ✨ Features

- ✅ User registration and login
- 🔐 JWT-based authentication
- 🛂 Role-based access control (Admin/User)
- 🧼 Input validation with **Zod**
- 📧 Email notifications with **Nodemailer**
- 🧠 Prisma ORM for clean and typed DB management
- 📁 Modular route/controller structure
- ⏰ Scheduled background jobs (via `node-cron`)

---

## 🧰 Technologies Used

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Zod](https://zod.dev/)
- [Nodemailer](https://nodemailer.com/about/)
- [JSON Web Tokens (JWT)](https://jwt.io/)
- [node-cron](https://www.npmjs.com/package/node-cron)

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js `>= 16.x`
- npm `>= 8.x`
- PostgreSQL database

### 🧪 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mox-27/authentication-system
   cd authentication-system
    ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   * Copy `.env.example` → `.env`
   * Update with your actual credentials.

4. **Set up the database:**

   ```bash
   npx prisma migrate dev
   ```

5. **Start the server:**
    - In Development
        ```bash
        npm run dev
        ```
    - In production
        ```bash
        npm start
        ```

---

## 🧱 Project Structure

```
├── src/
│   ├── config/            # Configuration files (e.g., nodemailer, JWT)
│   ├── controllers/       # Business logic for auth, users, admin
│   ├── middlewares/       # Middleware (auth, validation, roles)
│   ├── routes/            # Express route definitions
│   ├── zodValidations/    # Zod schemas for input validation
│   ├── chroneJob.js       # Scheduled cleanup jobs
│   └── index.js           # Entry point
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Auto-generated migrations
├── .env.example           # Environment variable template
├── package.json
└── README.md
```

---

## 🌐 API Endpoints

| Group | Base Route   | Description                      |
| ----- | ------------ | -------------------------------- |
| Auth  | `/api/auth`  | Registration, login, reset, etc. |
| User  | `/api/user`  | Self-profile management          |
| Admin | `/api/admin` | Admin-level user management      |

📌 For detailed request/response formats, refer to the route files in `src/routes/`.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory using the template below:

```dotenv
PORT=3000
NODE_ENV=development
DATABASE_URL=your_postgres_database_uri
CLIENT_BASE_URL=your_client_url

# Email service (SMTP)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
MAIL_FROM=

# Security
JWT_SECRET=your_jwt_secret
SUPER_ADMIN_EMAIL=super_admin_email
```

---

## 🗃 Running Migrations

Initialize or apply migrations:

```bash
npx prisma migrate dev
```

To generate a new migration:

```bash
npx prisma migrate dev --name meaningful_name
```


---

## 🤝 Contributing

Pull requests and feature ideas are always welcome.

* Fork it 🍴
* Make a branch 🚧
* Submit a PR 💬
* Let’s make it better, together.

---

## 📬 Contact

Need help? Suggestions? Cool memes?

**Email:** [moxvankar2005@example.com](mailto:moxvankar2005@example.com)

---

**Built for real-world scale, developer joy, and code that doesn't betray you in production.**
