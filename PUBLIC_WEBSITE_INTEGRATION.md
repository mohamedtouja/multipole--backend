# Public Website Integration Status

**Last Updated**: November 9, 2025  
**Status**: ✅ Ready for integration

---

## 📋 Overview

This document details the backend API integration with the Multi-Pôles public Next.js website. All content and form endpoints are configured and ready.

---

## ✅ Content API Endpoints

### **1. Blog Posts** (`/api/v1/content/blog`)

| Method | Endpoint | Parameters | Response | Description |
|--------|----------|------------|----------|-------------|
| GET | `/api/v1/content/blog` | `page`, `limit`, `category`, `tag`, `search`, `locale` | Paginated | Public published posts |
| GET | `/api/v1/content/blog/:slug` | `locale` | Single post | Get by slug (increments views) |

**Features**:
- ✅ Full-text search (title, excerpt, content)
- ✅ Category filtering
- ✅ Tag filtering  
- ✅ Pagination (default: page=1, limit=12)
- ✅ Locale support (fr/en)
- ✅ Auto-filters published status only

**Example**:
```bash
GET /api/v1/content/blog?page=1&limit=10&search=emballage&locale=fr
GET /api/v1/content/blog/mon-article-slug?locale=fr
```

---

### **2. Réalisations/Projects** (`/api/v1/content/realisations`)

| Method | Endpoint | Parameters | Response | Description |
|--------|----------|------------|----------|-------------|
| GET | `/api/v1/content/realisations` | `locale` | Array | All public projects |
| GET | `/api/v1/content/realisations/:id` | `locale` | Single | Get by ID |

**Features**:
- ✅ Project portfolio with images
- ✅ Client information
- ✅ Locale support

**Example**:
```bash
GET /api/v1/content/realisations?locale=fr
GET /api/v1/content/realisations/uuid-here?locale=fr
```

---

### **3. Carousel Slides** (`/api/v1/content/carousel`)

| Method | Endpoint | Parameters | Response | Description |
|--------|----------|------------|----------|-------------|
| GET | `/api/v1/content/carousel` | `locale` | Array | Homepage hero slides |

**Features**:
- ✅ Ordered slides
- ✅ Video/image support
- ✅ CTA buttons with links
- ✅ Active/inactive filtering

**Example**:
```bash
GET /api/v1/content/carousel?locale=fr
```

---

### **4. Solutions/Services** (`/api/v1/content/solutions`)

| Method | Endpoint | Parameters | Response | Description |
|--------|----------|------------|----------|-------------|
| GET | `/api/v1/content/solutions` | `locale` | Array | Service offerings |

**Features**:
- ✅ Ordered display
- ✅ Icon/image support
- ✅ Features list
- ✅ Multi-language

**Example**:
```bash
GET /api/v1/content/solutions?locale=fr
```

---

### **5. Team Members** (`/api/v1/content/team`)

| Method | Endpoint | Parameters | Response | Description |
|--------|----------|------------|----------|-------------|
| GET | `/api/v1/content/team` | `locale` | Array | Staff profiles |

**Features**:
- ✅ Ordered display
- ✅ Contact info
- ✅ Social links (LinkedIn)
- ✅ Profile photos

**Example**:
```bash
GET /api/v1/content/team?locale=fr
```

---

## ✅ Form Submission Endpoints

### **6. Contact Form** (`POST /api/v1/forms/contact`)

**Request Body**:
```typescript
{
  firstName: string;        // Required, 2-100 chars
  lastName: string;         // Required, 2-100 chars
  email: string;           // Required, valid email
  phone: string;           // Required, max 50 chars
  company?: string;        // Optional, max 255 chars
  message: string;         // Required, 10-2000 chars
  acceptTerms: boolean;    // Required, must be true
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Votre message a été envoyé avec succès. Nous vous répondrons bientôt."
}
```

**Error Response** (400 Bad Request):
```json
{
  "statusCode": 400,
  "message": ["firstName must be a string", "email must be an email"],
  "error": "Bad Request"
}
```

**Features**:
- ✅ Server-side validation
- ✅ Email sent to admin
- ✅ Confirmation email to user
- ✅ IP & User-Agent tracking
- ✅ Status tracking (pending/read/replied)

---

### **7. Devis/Quote Form** (`POST /api/v1/forms/devis`)

**Request Body**:
```typescript
{
  firstName: string;              // Required, 2-100 chars
  lastName: string;               // Required, 2-100 chars
  email: string;                 // Required, valid email
  phone: string;                 // Required, max 50 chars
  company: string;               // Required, max 255 chars
  projectType: string;           // Required, max 255 chars
  description: string;           // Required, 20-2000 chars
  budget?: string;               // Optional, max 100 chars
  quantity?: number;             // Optional, integer
  dimensions?: {                 // Optional
    width?: number;
    height?: number;
    depth?: number;
  };
  desiredDeliveryDate?: string;  // Optional, ISO date string
  acceptTerms: boolean;          // Required, must be true
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Votre demande de devis a été envoyée avec succès. Nous vous contacterons sous peu."
}
```

**Features**:
- ✅ Complex multi-field validation
- ✅ Email sent to admin with project details
- ✅ Confirmation email to user
- ✅ IP & User-Agent tracking
- ✅ Status tracking
- ✅ Automatic date conversion

---

## 🔧 Response Format

### **Paginated Response**
```typescript
{
  data: T[];
  meta: {
    total: number;        // Total items
    page: number;         // Current page
    limit: number;        // Items per page
    totalPages: number;   // Total pages
  }
}
```

### **Single Item Response**
```typescript
{
  id: string;
  title: string;
  // ... entity fields
  createdAt: string;
  updatedAt: string;
}
```

### **Error Response**
```typescript
{
  statusCode: number;
  message: string | string[];
  error: string;
}
```

---

## 🔐 CORS Configuration

**Configured Origins**:
```typescript
// main.ts
app.enableCors({
  origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
  credentials: true,
});
```

**Required .env**:
```env
FRONTEND_URL=http://localhost:3000      # Public website
DASHBOARD_URL=http://localhost:3001     # Admin dashboard
```

---

## 📝 Form DTOs Updated

### ✅ Contact Form Changes
**Old Structure** (before):
```typescript
{
  name: string;          // Single field
  email: string;
  phone?: string;
  message: string;
  acceptTerms: boolean;
}
```

**New Structure** (current):
```typescript
{
  firstName: string;     // Split name
  lastName: string;      // Split name
  email: string;
  phone: string;         // Now required
  company?: string;      // New field
  message: string;
  acceptTerms: boolean;
}
```

---

### ✅ Devis Form Changes
**Old Structure** (before):
```typescript
{
  projectType: string;
  dimensions?: {...};
  materials?: string[];
  colors?: string[];
  contact: {             // Nested object
    name: string;
    email: string;
    phone?: string;
  };
  additionalInfo?: string;
  acceptTerms: boolean;
}
```

**New Structure** (current):
```typescript
{
  firstName: string;              // Flattened
  lastName: string;               // Flattened
  email: string;                 // Flattened
  phone: string;                 // Flattened, required
  company: string;               // New required
  projectType: string;
  description: string;           // New required
  budget?: string;               // New optional
  quantity?: number;             // New optional
  dimensions?: {...};
  desiredDeliveryDate?: string;  // New optional
  acceptTerms: boolean;
}
```

---

## 🗄️ Database Entities

### Contact Form Entity
```sql
CREATE TABLE contact_forms (
  id UUID PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  company VARCHAR(255),
  message TEXT NOT NULL,
  accept_terms BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'pending',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Devis Form Entity
```sql
CREATE TABLE devis_forms (
  id UUID PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  company VARCHAR(255) NOT NULL,
  project_type VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  budget VARCHAR(100),
  quantity INTEGER,
  dimensions JSONB,
  desired_delivery_date DATE,
  accept_terms BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'pending',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📧 Email Notifications

### Contact Form Email
**To Admin**:
- Subject: "Nouveau message de contact - [Full Name]"
- Content: Name, email, phone, company, message

**To User**:
- Subject: "Confirmation - Votre message a été reçu"
- Content: Thank you message

### Devis Form Email
**To Admin**:
- Subject: "Nouvelle demande de devis - [Full Name] - [Company]"
- Content: All project details + contact info

**To User**:
- Subject: "Confirmation - Votre demande de devis a été reçue"
- Content: Confirmation with promise to contact

---

## 🚀 Setup Instructions

### 1. Environment Variables
Ensure `.env` includes:
```env
# Frontend CORS
FRONTEND_URL=http://localhost:3000

# Email (for form notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@multipoles.com
ADMIN_EMAIL=admin@multipoles.com
```

### 2. Database Migrations
Run migrations to update form entities:
```bash
npm run migration:generate src/migrations/UpdateFormEntities
npm run migration:run
```

### 3. Test Endpoints

**Test Blog**:
```bash
curl http://localhost:3000/api/v1/content/blog?locale=fr
```

**Test Contact Form**:
```bash
curl -X POST http://localhost:3000/api/v1/forms/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean@example.com",
    "phone": "0612345678",
    "message": "Test message",
    "acceptTerms": true
  }'
```

**Test Devis Form**:
```bash
curl -X POST http://localhost:3000/api/v1/forms/devis \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean@example.com",
    "phone": "0612345678",
    "company": "Entreprise ABC",
    "projectType": "PLV Display",
    "description": "Besoin de 10 présentoirs pour salon",
    "acceptTerms": true
  }'
```

---

## ✅ Integration Checklist

### Backend Ready
- [x] All content endpoints implemented
- [x] Form DTOs match frontend expectations
- [x] Database entities updated
- [x] Email service configured
- [x] CORS enabled for public website
- [x] Validation rules applied
- [x] Error handling standardized

### Frontend Integration
- [ ] Update `.env` with `NEXT_PUBLIC_API_URL=http://localhost:3000`
- [ ] Test all content pages load
- [ ] Test blog search/filtering
- [ ] Test contact form submission
- [ ] Test devis form submission
- [ ] Verify email notifications

---

## 🐛 Troubleshooting

### CORS Errors
**Problem**: "Access to fetch blocked by CORS policy"  
**Solution**: 
1. Verify `FRONTEND_URL` in backend `.env`
2. Restart backend after changing `.env`
3. Check browser console for actual origin

### Form Validation Errors
**Problem**: Form submission returns 400 with validation errors  
**Solution**:
1. Check all required fields are provided
2. Verify field formats (email, phone length, etc.)
3. Ensure `acceptTerms` is `true`, not string

### Email Not Sending
**Problem**: Form submits but no email received  
**Solution**:
1. Check SMTP credentials in `.env`
2. For Gmail, use App Password (not regular password)
3. Check backend logs for email errors
4. Verify `ADMIN_EMAIL` is correct

### Database Connection Error
**Problem**: "Cannot connect to database"  
**Solution**:
1. Ensure PostgreSQL is running
2. Check `DATABASE_*` variables in `.env`
3. Run migrations: `npm run migration:run`

---

## 📊 Expected Data Flow

```
┌──────────────────┐
│  Next.js Public  │
│    Website       │
│ (localhost:3000) │
└────────┬─────────┘
         │
         │ 1. User visits /blog
         │ 2. useApi hook fetches
         │
┌────────▼─────────┐
│  GET /api/v1/    │
│  content/blog    │
└────────┬─────────┘
         │
         │ 3. Query filters applied
         │ 4. Only published posts
         │
┌────────▼─────────┐
│  NestJS Backend  │
│ (localhost:3000) │
└────────┬─────────┘
         │
         │ 5. TypeORM query
         │
┌────────▼─────────┐
│   PostgreSQL DB  │
└──────────────────┘
```

---

## 🎯 Next Steps

1. **Start Backend**: `npm run start:dev` on port 3000
2. **Configure Frontend**: Set `NEXT_PUBLIC_API_URL=http://localhost:3000`
3. **Test Content**: Visit blog, realisations, etc.
4. **Test Forms**: Submit contact and devis forms
5. **Verify Emails**: Check admin email receives notifications

---

**Status**: ✅ Backend ready for public website integration!
