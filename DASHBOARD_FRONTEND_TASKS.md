# Dashboard Frontend - Implementation Tasks

**Project**: Multi-Pôles Admin Dashboard (Next.js)  
**Purpose**: Update dashboard to work with updated backend API  
**Priority**: High  
**Breaking Changes**: Yes - Form entity structure changed

---

## 📋 Overview

The backend has been updated with breaking changes to form entities. The dashboard needs updates to:
1. Display new form fields (Contact and Devis forms)
2. Update TypeScript types to match backend DTOs
3. Verify all API calls use correct HTTP methods (PATCH for updates)

**Good News**: Most API integration already correct! Only form display needs updates.

---

## ✅ What's Already Working

- ✅ Authentication (login, logout, refresh, me)
- ✅ HTTP methods correct (PATCH for updates)
- ✅ All CRUD operations (Blog, Réalisations, Solutions, Carousel, Team)
- ✅ API client with interceptors
- ✅ Image upload via presigned URLs

---

## 🔧 Required Changes

### 1. Update Form Types

**File**: `src/types/api.ts`

**Current Contact Form Type** (needs update):
```typescript
interface ContactForm {
  id: string;
  name: string;           // ❌ Will be removed
  email: string;
  phone?: string;         // ❌ Optional, now required
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
``` 

**New Contact Form Type** (implement this):
```typescript
interface ContactForm {
  id: string;
  firstName: string;      // ✅ New - split from name
  lastName: string;       // ✅ New - split from name
  email: string;
  phone: string;          // ✅ Now required (not optional)
  company?: string;       // ✅ New optional field
  message: string;
  status: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Current Devis Form Type** (needs major update):
```typescript
interface DevisForm {
  id: string;
  projectType: string;
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };
  materials?: string[];    // ❌ Removed
  colors?: string[];       // ❌ Removed
  contact: {               // ❌ Flattened
    name: string;
    email: string;
    phone?: string;
  };
  additionalInfo?: string; // ❌ Renamed to description
  status: string;
  createdAt: string;
  updatedAt: string;
}
```

**New Devis Form Type** (implement this):
```typescript
interface DevisForm {
  id: string;
  firstName: string;            // ✅ Flattened from contact
  lastName: string;             // ✅ Flattened from contact
  email: string;                // ✅ Flattened from contact
  phone: string;                // ✅ Flattened from contact
  company: string;              // ✅ New required field
  projectType: string;
  description: string;          // ✅ Renamed from additionalInfo, now required
  budget?: string;              // ✅ New optional field
  quantity?: number;            // ✅ New optional field
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };
  desiredDeliveryDate?: string; // ✅ New optional field (ISO date string)
  status: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

### 2. Update Forms Manager Component

**File**: `src/app/dashboard/forms/forms-manager.tsx` (or similar path)

#### Contact Forms Table/List View

**Current display** (needs update):
```tsx
// ❌ Old structure
<TableRow>
  <TableCell>{form.name}</TableCell>
  <TableCell>{form.email}</TableCell>
  <TableCell>{form.phone || 'N/A'}</TableCell>
  <TableCell>{form.message}</TableCell>
  <TableCell>{form.status}</TableCell>
  <TableCell>{formatDate(form.createdAt)}</TableCell>
</TableRow>
```

**New display** (implement this):
```tsx
// ✅ New structure
<TableRow>
  <TableCell>{form.firstName} {form.lastName}</TableCell>
  <TableCell>{form.email}</TableCell>
  <TableCell>{form.phone}</TableCell>
  <TableCell>{form.company || '-'}</TableCell>  {/* New column */}
  <TableCell className="max-w-xs truncate">{form.message}</TableCell>
  <TableCell>
    <Badge variant={getStatusVariant(form.status)}>
      {form.status}
    </Badge>
  </TableCell>
  <TableCell>{formatDate(form.createdAt)}</TableCell>
</TableRow>
```

**Update table headers**:
```tsx
<TableHead>
  <TableRow>
    <TableHeader>Name</TableHeader>           {/* Changed from single to full */}
    <TableHeader>Email</TableHeader>
    <TableHeader>Phone</TableHeader>
    <TableHeader>Company</TableHeader>        {/* New header */}
    <TableHeader>Message</TableHeader>
    <TableHeader>Status</TableHeader>
    <TableHeader>Date</TableHeader>
  </TableRow>
</TableHead>
```

#### Contact Form Detail Modal/View

**Current detail view** (needs update):
```tsx
// ❌ Old structure
<div>
  <h3>Contact Details</h3>
  <p><strong>Name:</strong> {form.name}</p>
  <p><strong>Email:</strong> {form.email}</p>
  <p><strong>Phone:</strong> {form.phone || 'Not provided'}</p>
  <p><strong>Message:</strong></p>
  <p>{form.message}</p>
</div>
```

**New detail view** (implement this):
```tsx
// ✅ New structure
<div className="space-y-4">
  <div>
    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-sm text-gray-500">First Name</label>
        <p className="font-medium">{form.firstName}</p>
      </div>
      <div>
        <label className="text-sm text-gray-500">Last Name</label>
        <p className="font-medium">{form.lastName}</p>
      </div>
      <div>
        <label className="text-sm text-gray-500">Email</label>
        <p className="font-medium">{form.email}</p>
      </div>
      <div>
        <label className="text-sm text-gray-500">Phone</label>
        <p className="font-medium">{form.phone}</p>
      </div>
      {form.company && (
        <div className="col-span-2">
          <label className="text-sm text-gray-500">Company</label>
          <p className="font-medium">{form.company}</p>
        </div>
      )}
    </div>
  </div>
  
  <div>
    <label className="text-sm text-gray-500">Message</label>
    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
      <p className="whitespace-pre-wrap">{form.message}</p>
    </div>
  </div>
  
  <div>
    <label className="text-sm text-gray-500">Status</label>
    <select 
      value={form.status}
      onChange={(e) => updateStatus(form.id, e.target.value)}
      className="mt-1 block w-full rounded-md border-gray-300"
    >
      <option value="pending">Pending</option>
      <option value="read">Read</option>
      <option value="replied">Replied</option>
      <option value="archived">Archived</option>
    </select>
  </div>
  
  <div className="text-sm text-gray-500">
    <p>Submitted: {formatDate(form.createdAt)}</p>
    {form.ipAddress && <p>IP: {form.ipAddress}</p>}
  </div>
</div>
```

---

#### Devis Forms Table/List View

**Current display** (needs major update):
```tsx
// ❌ Old structure
<TableRow>
  <TableCell>{form.contact.name}</TableCell>
  <TableCell>{form.contact.email}</TableCell>
  <TableCell>{form.projectType}</TableCell>
  <TableCell>{form.additionalInfo || '-'}</TableCell>
  <TableCell>{form.status}</TableCell>
</TableRow>
```

**New display** (implement this):
```tsx
// ✅ New structure
<TableRow>
  <TableCell>{form.firstName} {form.lastName}</TableCell>
  <TableCell>{form.company}</TableCell>          {/* New */}
  <TableCell>{form.email}</TableCell>
  <TableCell>{form.phone}</TableCell>
  <TableCell>{form.projectType}</TableCell>
  <TableCell className="max-w-xs truncate">{form.description}</TableCell>
  {form.budget && <TableCell>{form.budget}</TableCell>}
  {form.quantity && <TableCell>{form.quantity}</TableCell>}
  <TableCell>
    <Badge variant={getStatusVariant(form.status)}>
      {form.status}
    </Badge>
  </TableCell>
  <TableCell>{formatDate(form.createdAt)}</TableCell>
</TableRow>
```

**Update table headers**:
```tsx
<TableHead>
  <TableRow>
    <TableHeader>Name</TableHeader>
    <TableHeader>Company</TableHeader>           {/* New */}
    <TableHeader>Email</TableHeader>
    <TableHeader>Phone</TableHeader>
    <TableHeader>Project Type</TableHeader>
    <TableHeader>Description</TableHeader>       {/* Renamed */}
    <TableHeader>Budget</TableHeader>            {/* New */}
    <TableHeader>Quantity</TableHeader>          {/* New */}
    <TableHeader>Status</TableHeader>
    <TableHeader>Date</TableHeader>
  </TableRow>
</TableHead>
```

#### Devis Form Detail Modal/View

**Current detail view** (needs major update):
```tsx
// ❌ Old structure
<div>
  <h3>Quote Request Details</h3>
  <div>
    <h4>Contact</h4>
    <p>Name: {form.contact.name}</p>
    <p>Email: {form.contact.email}</p>
    <p>Phone: {form.contact.phone || 'Not provided'}</p>
  </div>
  <div>
    <h4>Project</h4>
    <p>Type: {form.projectType}</p>
    <p>Info: {form.additionalInfo}</p>
  </div>
</div>
```

**New detail view** (implement this):
```tsx
// ✅ New structure
<div className="space-y-6">
  <div>
    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-sm text-gray-500">First Name</label>
        <p className="font-medium">{form.firstName}</p>
      </div>
      <div>
        <label className="text-sm text-gray-500">Last Name</label>
        <p className="font-medium">{form.lastName}</p>
      </div>
      <div>
        <label className="text-sm text-gray-500">Company</label>
        <p className="font-medium">{form.company}</p>
      </div>
      <div>
        <label className="text-sm text-gray-500">Email</label>
        <p className="font-medium">{form.email}</p>
      </div>
      <div>
        <label className="text-sm text-gray-500">Phone</label>
        <p className="font-medium">{form.phone}</p>
      </div>
    </div>
  </div>

  <div>
    <h3 className="text-lg font-semibold mb-4">Project Details</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className="text-sm text-gray-500">Project Type</label>
        <p className="font-medium">{form.projectType}</p>
      </div>
      <div className="col-span-2">
        <label className="text-sm text-gray-500">Description</label>
        <div className="mt-2 p-4 bg-gray-50 rounded-lg">
          <p className="whitespace-pre-wrap">{form.description}</p>
        </div>
      </div>
      {form.budget && (
        <div>
          <label className="text-sm text-gray-500">Budget</label>
          <p className="font-medium">{form.budget}</p>
        </div>
      )}
      {form.quantity && (
        <div>
          <label className="text-sm text-gray-500">Quantity</label>
          <p className="font-medium">{form.quantity}</p>
        </div>
      )}
      {form.dimensions && (
        <div className="col-span-2">
          <label className="text-sm text-gray-500">Dimensions</label>
          <p className="font-medium">
            {form.dimensions.width ? `W: ${form.dimensions.width}cm` : ''} 
            {form.dimensions.height ? ` × H: ${form.dimensions.height}cm` : ''} 
            {form.dimensions.depth ? ` × D: ${form.dimensions.depth}cm` : ''}
          </p>
        </div>
      )}
      {form.desiredDeliveryDate && (
        <div>
          <label className="text-sm text-gray-500">Desired Delivery Date</label>
          <p className="font-medium">{formatDate(form.desiredDeliveryDate)}</p>
        </div>
      )}
    </div>
  </div>

  <div>
    <label className="text-sm text-gray-500">Status</label>
    <select 
      value={form.status}
      onChange={(e) => updateStatus(form.id, e.target.value)}
      className="mt-1 block w-full rounded-md border-gray-300"
    >
      <option value="pending">Pending</option>
      <option value="in_review">In Review</option>
      <option value="quoted">Quoted</option>
      <option value="accepted">Accepted</option>
      <option value="rejected">Rejected</option>
      <option value="archived">Archived</option>
    </select>
  </div>

  <div className="text-sm text-gray-500 pt-4 border-t">
    <p>Submitted: {formatDate(form.createdAt)}</p>
    {form.ipAddress && <p>IP: {form.ipAddress}</p>}
    {form.userAgent && <p className="truncate">User Agent: {form.userAgent}</p>}
  </div>
</div>
```

---

### 3. Update API Service (if needed)

**File**: `src/lib/api/forms.service.ts`

The API endpoints are correct, but verify the response handling:

```typescript
// Should already be correct, but verify:
export const getContactForms = async (page = 1, limit = 50) => {
  const response = await apiClient.get<PaginatedResponse<ContactForm>>(
    `/admin/forms/contact?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const getDevisForms = async (page = 1, limit = 50) => {
  const response = await apiClient.get<PaginatedResponse<DevisForm>>(
    `/admin/forms/devis?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const updateContactFormStatus = async (id: string, status: string) => {
  const response = await apiClient.patch(`/admin/forms/contact/${id}/status`, {
    status,
  });
  return response.data;
};

export const updateDevisFormStatus = async (id: string, status: string) => {
  const response = await apiClient.patch(`/admin/forms/devis/${id}/status`, {
    status,
  });
  return response.data;
};
```

---

### 4. Add Helper Functions

**File**: `src/lib/utils/forms.ts` (create if doesn't exist)

```typescript
/**
 * Format full name from first and last name
 */
export const formatFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`;
};

/**
 * Get status badge variant for contact/devis forms
 */
export const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'destructive' => {
  const variants: Record<string, 'default' | 'success' | 'warning' | 'destructive'> = {
    pending: 'warning',
    read: 'default',
    in_review: 'default',
    replied: 'success',
    quoted: 'success',
    accepted: 'success',
    rejected: 'destructive',
    archived: 'default',
  };
  return variants[status] || 'default';
};

/**
 * Format date for display
 */
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
};

/**
 * Format dimensions for display
 */
export const formatDimensions = (dimensions?: {
  width?: number;
  height?: number;
  depth?: number;
}): string => {
  if (!dimensions) return 'N/A';
  
  const parts = [];
  if (dimensions.width) parts.push(`L: ${dimensions.width}cm`);
  if (dimensions.height) parts.push(`H: ${dimensions.height}cm`);
  if (dimensions.depth) parts.push(`P: ${dimensions.depth}cm`);
  
  return parts.length > 0 ? parts.join(' × ') : 'N/A';
};
```

---

## 📁 Files to Modify

### Required Changes
1. ✏️ `src/types/api.ts` - Update ContactForm and DevisForm interfaces
2. ✏️ `src/app/dashboard/forms/forms-manager.tsx` - Update display logic
3. ✏️ `src/app/dashboard/forms/contact-forms.tsx` - Update if separate component
4. ✏️ `src/app/dashboard/forms/devis-forms.tsx` - Update if separate component

### Optional (if exists)
5. ✏️ `src/components/forms/ContactFormDetail.tsx` - Update detail view
6. ✏️ `src/components/forms/DevisFormDetail.tsx` - Update detail view
7. ✏️ `src/lib/utils/forms.ts` - Add helper functions (create if needed)

### Verify (should already be correct)
8. ✅ `src/lib/api/forms.service.ts` - API calls
9. ✅ `src/lib/api/blog.service.ts` - Uses PATCH for updates
10. ✅ `src/lib/api/realisations.service.ts` - Uses PATCH for updates
11. ✅ All other API services - Should use PATCH for updates

---

## 🧪 Testing Checklist

### 1. Forms Display
- [ ] Navigate to Dashboard → Forms section
- [ ] Contact forms table displays with new columns (Name split, Company)
- [ ] Devis forms table displays with new columns (Company, Budget, Quantity)
- [ ] No TypeScript errors in console
- [ ] Data loads correctly from API

### 2. Contact Form Details
- [ ] Click on a contact form to view details
- [ ] First name and last name display separately
- [ ] Company field displays (or shows "Not provided" if empty)
- [ ] Phone number always displays (not "Not provided")
- [ ] All other fields display correctly
- [ ] Status can be updated

### 3. Devis Form Details
- [ ] Click on a devis form to view details
- [ ] Contact info displays correctly (first name, last name, company)
- [ ] Description field shows (not "additionalInfo")
- [ ] Budget displays if provided
- [ ] Quantity displays if provided
- [ ] Desired delivery date displays if provided
- [ ] Dimensions display correctly formatted
- [ ] Status can be updated

### 4. API Integration
- [ ] Forms list loads without errors
- [ ] Pagination works
- [ ] Status updates save successfully
- [ ] No 400 errors in network tab
- [ ] Response data matches new structure

### 5. Edge Cases
- [ ] Forms with missing optional fields display gracefully
- [ ] Long messages/descriptions don't break layout
- [ ] Date formatting works correctly
- [ ] Status badges show correct colors
- [ ] Empty states work if no forms

---

## 🐛 Expected Issues & Solutions

### Issue 1: Old forms in database
**Problem**: Forms submitted before backend update have old structure  
**Solution**: Backend migration should handle this, but add fallback:
```typescript
// In display component
const displayName = form.firstName && form.lastName 
  ? `${form.firstName} ${form.lastName}`
  : form.name || 'N/A';  // Fallback to old 'name' field
```

### Issue 2: TypeScript errors on form.contact
**Problem**: Devis forms no longer have nested `contact` object  
**Solution**: Remove any `form.contact.name` references, use `form.firstName` instead

### Issue 3: Phone showing as "Not provided"
**Problem**: Phone is now required, should always have value  
**Solution**: Remove optional checks, display directly: `{form.phone}`

---

## 📋 Implementation Checklist

### Phase 1: Types (5 minutes)
- [ ] Open `src/types/api.ts`
- [ ] Update `ContactForm` interface
- [ ] Update `DevisForm` interface
- [ ] Remove unused interfaces (if any)
- [ ] Run `npm run type-check` to verify

### Phase 2: Forms Manager (20 minutes)
- [ ] Open forms manager component
- [ ] Update contact forms table headers
- [ ] Update contact forms table cells
- [ ] Update devis forms table headers
- [ ] Update devis forms table cells
- [ ] Test in browser

### Phase 3: Detail Views (15 minutes)
- [ ] Update contact form detail view
- [ ] Update devis form detail view
- [ ] Add helper functions if needed
- [ ] Test all fields display correctly

### Phase 4: Testing (10 minutes)
- [ ] Test with real backend data
- [ ] Check all fields display
- [ ] Test status updates
- [ ] Verify no console errors
- [ ] Test on different screen sizes

---

## 🚀 Quick Start

```bash
# 1. Navigate to dashboard project
cd /path/to/multipoles-dashboard

# 2. Create a new branch
git checkout -b update-forms-structure

# 3. Update types
# Edit src/types/api.ts

# 4. Update forms manager
# Edit src/app/dashboard/forms/forms-manager.tsx

# 5. Test
npm run dev

# 6. Login and check Forms section
# http://localhost:3001/dashboard/forms

# 7. Verify all changes work

# 8. Commit changes
git add .
git commit -m "Update forms structure to match backend changes"
```

---

## 📞 Backend API Reference

### Contact Form Response
```json
{
  "id": "uuid",
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@example.com",
  "phone": "0612345678",
  "company": "ABC Corp",
  "message": "Hello, I need information...",
  "status": "pending",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "createdAt": "2025-11-09T20:00:00.000Z",
  "updatedAt": "2025-11-09T20:00:00.000Z"
}
```

### Devis Form Response
```json
{
  "id": "uuid",
  "firstName": "Marie",
  "lastName": "Martin",
  "email": "marie@example.com",
  "phone": "0687654321",
  "company": "XYZ Ltd",
  "projectType": "PLV Display",
  "description": "We need 50 displays for retail stores",
  "budget": "10000-20000",
  "quantity": 50,
  "dimensions": {
    "width": 100,
    "height": 200,
    "depth": 30
  },
  "desiredDeliveryDate": "2025-12-01",
  "status": "pending",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "createdAt": "2025-11-09T20:00:00.000Z",
  "updatedAt": "2025-11-09T20:00:00.000Z"
}
```

---

## ✅ Definition of Done

- [ ] All TypeScript types updated
- [ ] Contact forms display with new fields
- [ ] Devis forms display with new fields
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Status updates work
- [ ] All fields display correctly
- [ ] Code tested with backend
- [ ] Changes committed to git

---

**Total Estimated Time**: 1 hour  
**Difficulty**: Medium  
**Breaking**: Yes - requires backend migration first

**Ready to implement!** 🚀
