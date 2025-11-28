# Multipoles Backend - Setup Guide

Production-ready NestJS backend for Multipoles website and admin dashboard.

## Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

## Environment Configuration

Edit `.env` with your actual values:

### Database
Configure your PostgreSQL connection:
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=multipoles
```

### JWT Secrets
**IMPORTANT**: Generate secure random secrets for production:
```bash
# Generate secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Set in `.env`:
```
JWT_ACCESS_SECRET=your-generated-secret
JWT_REFRESH_SECRET=your-generated-secret
```

### AWS S3 (for file uploads)
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=multipoles-assets
```

### SMTP (for emails)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@multipoles.com
```

## Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE multipoles;"

# Run application (auto-sync enabled in development)
npm run start:dev
```

**Note**: For production, use migrations instead of `synchronize: true`.

## Running the Application

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod

# Run linter
npm run lint

# Run tests
npm test
```

## API Endpoints

### Auth (Public)
- `POST /api/v1/auth/login` - Admin login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user (protected)

### Blog
**Public:**
- `GET /api/v1/content/blog` - List published posts
- `GET /api/v1/content/blog/:slug` - Get post by slug

**Admin (requires JWT):**
- `POST /api/v1/admin/blog` - Create post
- `GET /api/v1/admin/blog` - List all posts
- `PUT /api/v1/admin/blog/:id` - Update post
- `DELETE /api/v1/admin/blog/:id` - Delete post
- `POST /api/v1/admin/blog/:id/publish` - Publish post
- `POST /api/v1/admin/blog/:id/schedule` - Schedule post

### Realisations, Solutions, Carousel, Team, Forms, Models, Simulator, Activities
Similar pattern with public read endpoints and protected admin CRUD.

## Creating Admin User

```bash
# Use psql or your DB tool
psql -U postgres -d multipoles

INSERT INTO users (id, email, password, role, "firstName", "lastName")
VALUES (
  gen_random_uuid(),
  'admin@multipoles.com',
  -- Hash generated with bcrypt (rounds=12) for password "Admin@123"
  '$2b$12$example_hash_replace_with_real_bcrypt_hash',
  'ADMIN',
  'Admin',
  'User'
);
```

**Generate password hash:**
```javascript
const bcrypt = require('bcrypt');
bcrypt.hash('YourPassword', 12).then(console.log);
```

## Security Checklist

- [  ] Change all default secrets in production
- [  ] Use environment variables (never commit `.env`)
- [  ] Enable HTTPS in production
- [  ] Configure CORS for specific origins
- [  ] Set up rate limiting
- [  ] Use database migrations (disable `synchronize` in prod)
- [  ] Enable helmet middleware
- [  ] Implement refresh token rotation
- [  ] Set up logging and monitoring

## Architecture

```
src/
├── common/           # Shared utilities, guards, decorators
├── modules/
│   ├── auth/         # Authentication & JWT
│   ├── users/        # User management
│   ├── blog/         # Blog posts
│   ├── realisations/ # Projects/Realisations
│   ├── solutions/    # Solution categories
│   ├── carousel/     # Homepage carousel
│   ├── team/         # Team members
│   ├── forms/        # Contact & Devis forms
│   ├── models/       # 3D Models
│   ├── simulator/    # Simulator configs
│   └── activities/   # Activity logs & stats
└── main.ts           # Application entry
```

## Support

For issues or questions, contact: admin@multipoles.com
