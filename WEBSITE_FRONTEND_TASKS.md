# Public Website Frontend - Implementation Tasks

**Project**: Multi-Pôles Public Website (Next.js)  
**Purpose**: Update forms to work with updated backend API  
**Priority**: High - BREAKING CHANGES

---

## 📋 Overview

Backend forms updated with breaking changes. Update required for:
1. Contact Form - Split name, add company, phone now required
2. Devis Form - Flatten structure, add new fields
3. Validation schemas
4. TypeScript types

---

## 🔧 Task 1: Update Contact Form

### File: `src/types/api.ts`

**Change from:**
```typescript
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  acceptTerms: boolean;
}
```

**To:**
```typescript
interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;         // Now required
  company?: string;      // New field
  message: string;
  acceptTerms: boolean;
}
```

### File: `src/lib/validations/schemas.ts`

```typescript
export const contactSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(1).max(50),
  company: z.string().max(255).optional(),
  message: z.string().min(10).max(2000),
  acceptTerms: z.boolean().refine(val => val === true),
});
```

### File: `src/components/ContactForm.tsx` or `src/app/contact/page.tsx`

**Update form fields:**
```tsx
<form onSubmit={handleSubmit(onSubmit)}>
  {/* Replace single name field with two fields */}
  <div>
    <label>Prénom *</label>
    <input {...register('firstName')} />
    {errors.firstName && <span>{errors.firstName.message}</span>}
  </div>

  <div>
    <label>Nom *</label>
    <input {...register('lastName')} />
    {errors.lastName && <span>{errors.lastName.message}</span>}
  </div>

  <div>
    <label>Email *</label>
    <input type="email" {...register('email')} />
    {errors.email && <span>{errors.email.message}</span>}
  </div>

  <div>
    <label>Téléphone *</label>
    <input type="tel" {...register('phone')} />
    {errors.phone && <span>{errors.phone.message}</span>}
  </div>

  {/* NEW FIELD */}
  <div>
    <label>Entreprise (optionnel)</label>
    <input {...register('company')} />
    {errors.company && <span>{errors.company.message}</span>}
  </div>

  <div>
    <label>Message *</label>
    <textarea {...register('message')} rows={5} />
    {errors.message && <span>{errors.message.message}</span>}
  </div>

  <div>
    <input type="checkbox" {...register('acceptTerms')} />
    <label>J'accepte les conditions d'utilisation *</label>
    {errors.acceptTerms && <span>{errors.acceptTerms.message}</span>}
  </div>

  <button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Envoi...' : 'Envoyer'}
  </button>
</form>
```

---

## 🔧 Task 2: Update Devis/Quote Form

### File: `src/types/api.ts`

**Change from:**
```typescript
interface DevisFormData {
  projectType: string;
  dimensions?: { width?: number; height?: number; depth?: number };
  materials?: string[];
  colors?: string[];
  contact: {
    name: string;
    email: string;
    phone?: string;
  };
  additionalInfo?: string;
  acceptTerms: boolean;
}
```

**To:**
```typescript
interface DevisFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  description: string;
  budget?: string;
  quantity?: number;
  dimensions?: { width?: number; height?: number; depth?: number };
  desiredDeliveryDate?: string;
  acceptTerms: boolean;
}
```

### File: `src/lib/validations/schemas.ts`

```typescript
export const devisSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(1).max(50),
  company: z.string().min(1).max(255),
  projectType: z.string().min(1).max(255),
  description: z.string().min(20).max(2000),
  budget: z.string().max(100).optional(),
  quantity: z.number().optional(),
  dimensions: z.object({
    width: z.number().optional(),
    height: z.number().optional(),
    depth: z.number().optional(),
  }).optional(),
  desiredDeliveryDate: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true),
});
```

### File: `src/components/DevisForm.tsx` or `src/app/devis/page.tsx`

**Update form structure** - Remove nested `contact` object, add new fields:

```tsx
<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
  {/* Contact Information */}
  <div className="space-y-4">
    <h3>Informations de contact</h3>
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label>Prénom *</label>
        <input {...register('firstName')} />
        {errors.firstName && <span>{errors.firstName.message}</span>}
      </div>
      
      <div>
        <label>Nom *</label>
        <input {...register('lastName')} />
        {errors.lastName && <span>{errors.lastName.message}</span>}
      </div>
    </div>

    <div>
      <label>Entreprise *</label>
      <input {...register('company')} />
      {errors.company && <span>{errors.company.message}</span>}
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label>Email *</label>
        <input type="email" {...register('email')} />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label>Téléphone *</label>
        <input type="tel" {...register('phone')} />
        {errors.phone && <span>{errors.phone.message}</span>}
      </div>
    </div>
  </div>

  {/* Project Details */}
  <div className="space-y-4">
    <h3>Détails du projet</h3>

    <div>
      <label>Type de projet *</label>
      <select {...register('projectType')}>
        <option value="">Sélectionnez un type</option>
        <option value="PLV Display">PLV Display</option>
        <option value="Packaging">Packaging</option>
        <option value="Signalétique">Signalétique</option>
        <option value="Autre">Autre</option>
      </select>
      {errors.projectType && <span>{errors.projectType.message}</span>}
    </div>

    <div>
      <label>Description du projet *</label>
      <textarea {...register('description')} rows={5} 
        placeholder="Décrivez votre projet en détail (minimum 20 caractères)" />
      {errors.description && <span>{errors.description.message}</span>}
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label>Budget estimé (optionnel)</label>
        <select {...register('budget')}>
          <option value="">Sélectionnez un budget</option>
          <option value="< 5000€">Moins de 5000€</option>
          <option value="5000-10000€">5000€ - 10000€</option>
          <option value="10000-20000€">10000€ - 20000€</option>
          <option value="> 20000€">Plus de 20000€</option>
        </select>
      </div>

      <div>
        <label>Quantité (optionnel)</label>
        <input 
          type="number" 
          {...register('quantity', { valueAsNumber: true })} 
          min="1"
        />
      </div>
    </div>

    <div>
      <label>Dimensions (optionnel)</label>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <input 
            type="number" 
            {...register('dimensions.width', { valueAsNumber: true })}
            placeholder="Largeur (cm)"
          />
        </div>
        <div>
          <input 
            type="number" 
            {...register('dimensions.height', { valueAsNumber: true })}
            placeholder="Hauteur (cm)"
          />
        </div>
        <div>
          <input 
            type="number" 
            {...register('dimensions.depth', { valueAsNumber: true })}
            placeholder="Profondeur (cm)"
          />
        </div>
      </div>
    </div>

    <div>
      <label>Date de livraison souhaitée (optionnel)</label>
      <input type="date" {...register('desiredDeliveryDate')} />
    </div>
  </div>

  <div>
    <input type="checkbox" {...register('acceptTerms')} />
    <label>J'accepte les conditions d'utilisation *</label>
    {errors.acceptTerms && <span>{errors.acceptTerms.message}</span>}
  </div>

  <button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
  </button>
</form>
```

---

## 🔧 Task 3: Verify API Client

File: `src/lib/public-api.ts`

Endpoints should already be correct:

```typescript
// Should work as-is
async submitContactForm(data: ContactFormData) {
  return this.post('/forms/contact', data);
}

async submitDevisForm(data: DevisFormData) {
  return this.post('/forms/devis', data);
}
```

---

## 🧪 Testing Checklist

### Contact Form
- [ ] Visit `/contact` page
- [ ] Fill firstName, lastName (not single name field)
- [ ] Phone is required (can't submit without it)
- [ ] Company field exists (optional)
- [ ] Form submits successfully
- [ ] Success message displays
- [ ] Email notification received

### Devis Form
- [ ] Visit `/devis` page
- [ ] Contact section has firstName, lastName, company, email, phone
- [ ] Company is required (can't submit without it)
- [ ] Description field exists (min 20 chars)
- [ ] Budget dropdown exists
- [ ] Quantity field exists
- [ ] Dimensions fields exist (3 separate inputs)
- [ ] Desired delivery date field exists
- [ ] Form submits successfully
- [ ] Success message displays
- [ ] Email notification received

### Error Handling
- [ ] Try submitting without required fields
- [ ] Validation errors display correctly
- [ ] Try submitting with invalid email
- [ ] Try description < 20 characters
- [ ] Network errors handled gracefully

---

## 📁 Files to Modify

1. ✏️ `src/types/api.ts` - Update interfaces
2. ✏️ `src/lib/validations/schemas.ts` - Update Zod schemas
3. ✏️ `src/components/ContactForm.tsx` or `src/app/contact/page.tsx` - Update form
4. ✏️ `src/components/DevisForm.tsx` or `src/app/devis/page.tsx` - Update form
5. ✅ `src/lib/public-api.ts` - Verify (should be correct)

---

## ⚠️ Common Errors & Solutions

### Error: 400 Bad Request
**Cause**: Form data doesn't match backend expectations  
**Fix**: Ensure all required fields sent, check field names match exactly

### Error: "firstName must be a string"
**Cause**: Still sending `name` field instead of `firstName` + `lastName`  
**Fix**: Update form fields and validation

### Error: "company must be a string" (Devis)
**Cause**: Company is now required for Devis  
**Fix**: Make company field required in Devis form

### Error: "description must be at least 20 characters"
**Cause**: Description (old additionalInfo) now has minimum length  
**Fix**: Add validation and user guidance

---

## 🚀 Quick Implementation

```bash
# 1. Navigate to website project
cd /path/to/multipoles-website

# 2. Update types
# Edit src/types/api.ts

# 3. Update validation
# Edit src/lib/validations/schemas.ts

# 4. Update Contact form
# Edit src/components/ContactForm.tsx

# 5. Update Devis form
# Edit src/components/DevisForm.tsx

# 6. Test
npm run dev
# Visit /contact and /devis

# 7. Submit test forms
# Verify backend accepts them
```

---

## 📋 API Request Examples

### Contact Form POST
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@example.com",
  "phone": "0612345678",
  "company": "ABC Corp",
  "message": "Bonjour, je souhaite des informations sur vos services.",
  "acceptTerms": true
}
```

### Devis Form POST
```json
{
  "firstName": "Marie",
  "lastName": "Martin",
  "email": "marie@example.com",
  "phone": "0687654321",
  "company": "XYZ Ltd",
  "projectType": "PLV Display",
  "description": "Nous avons besoin de 50 présentoirs pour nos magasins",
  "budget": "10000-20000€",
  "quantity": 50,
  "dimensions": {
    "width": 100,
    "height": 200,
    "depth": 30
  },
  "desiredDeliveryDate": "2025-12-01",
  "acceptTerms": true
}
```

---

**Estimated Time**: 1-2 hours  
**Difficulty**: Medium  
**Status**: Ready to implement

**Go ahead and implement!** 🚀
