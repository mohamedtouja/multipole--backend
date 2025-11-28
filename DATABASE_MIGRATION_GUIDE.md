# Database Migration Guide

**Migration Required**: Yes - Form entities structure changed  
**Breaking Changes**: Yes - Contact and Devis form tables schema updated

---

## ⚠️ Important Notice

The form entities have been updated to match both the **admin dashboard** and **public website** requirements. These changes are **breaking** and require database migration.

---

## 🔄 Schema Changes

### Contact Forms Table

**Old Schema**:
```sql
contact_forms (
  id,
  name VARCHAR(255),           -- Single name field
  email,
  phone VARCHAR(50) NULL,      -- Optional
  message,
  accept_terms,
  status,
  ip_address,
  user_agent,
  created_at,
  updated_at
)
```

**New Schema**:
```sql
contact_forms (
  id,
  first_name VARCHAR(100),     -- Split name
  last_name VARCHAR(100),      -- Split name
  email,
  phone VARCHAR(50),           -- Now required
  company VARCHAR(255) NULL,   -- New field
  message,
  accept_terms,
  status,
  ip_address,
  user_agent,
  created_at,
  updated_at
)
```

**Changes**:
- ✅ Split `name` into `firstName` and `lastName`
- ✅ `phone` is now required (not nullable)
- ✅ Added `company` field (optional)
- ✅ Adjusted field lengths

---

### Devis Forms Table

**Old Schema**:
```sql
devis_forms (
  id,
  project_type,
  dimensions JSONB NULL,
  materials TEXT[] NULL,
  colors TEXT[] NULL,
  contact JSONB,               -- Nested object
  additional_info TEXT NULL,
  accept_terms,
  status,
  ip_address,
  user_agent,
  created_at,
  updated_at
)
```

**New Schema**:
```sql
devis_forms (
  id,
  first_name VARCHAR(100),           -- From contact.name
  last_name VARCHAR(100),            -- From contact.name
  email VARCHAR(255),                -- From contact.email
  phone VARCHAR(50),                 -- From contact.phone
  company VARCHAR(255),              -- New required
  project_type,
  description TEXT,                  -- New required (was additionalInfo)
  budget VARCHAR(100) NULL,          -- New optional
  quantity INTEGER NULL,             -- New optional
  dimensions JSONB NULL,
  desired_delivery_date DATE NULL,   -- New optional
  accept_terms,
  status,
  ip_address,
  user_agent,
  created_at,
  updated_at
)
```

**Changes**:
- ✅ Flattened `contact` nested object into separate fields
- ✅ Split contact name into `firstName` and `lastName`
- ✅ Added `company` (required)
- ✅ Renamed `additionalInfo` to `description` (required)
- ✅ Added `budget` (optional)
- ✅ Added `quantity` (optional)
- ✅ Added `desiredDeliveryDate` (optional)
- ✅ Removed `materials` and `colors` arrays

---

## 🛠️ Migration Options

### Option 1: Auto-Migration (Development)

If you have **synchronize: true** in TypeORM config (development only):

```typescript
// app.module.ts or database config
TypeOrmModule.forRoot({
  // ...
  synchronize: true,  // Only for development!
})
```

**Steps**:
1. Backup your database
2. Start the application
3. TypeORM will attempt auto-migration
4. **WARNING**: May lose data if columns are incompatible

---

### Option 2: Manual Migration (Recommended)

#### Step 1: Generate Migration

```bash
npm run typeorm migration:generate src/migrations/UpdateFormEntities
```

This will create a migration file based on entity changes.

#### Step 2: Review Generated Migration

Check the generated file in `src/migrations/`. It should contain:

```typescript
export class UpdateFormEntities1699999999999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns
    // Migrate existing data
    // Drop old columns
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback changes
  }
}
```

#### Step 3: Run Migration

```bash
npm run typeorm migration:run
```

---

### Option 3: Manual SQL (Production)

For production environments, use explicit SQL migrations:

#### Contact Forms Migration

```sql
-- Step 1: Add new columns
ALTER TABLE contact_forms
  ADD COLUMN first_name VARCHAR(100),
  ADD COLUMN last_name VARCHAR(100),
  ADD COLUMN company VARCHAR(255);

-- Step 2: Migrate existing data (if any)
UPDATE contact_forms
SET 
  first_name = SPLIT_PART(name, ' ', 1),
  last_name = SPLIT_PART(name, ' ', 2);

-- Step 3: Make firstName and lastName NOT NULL
ALTER TABLE contact_forms
  ALTER COLUMN first_name SET NOT NULL,
  ALTER COLUMN last_name SET NOT NULL;

-- Step 4: Make phone NOT NULL (after handling NULL values)
UPDATE contact_forms SET phone = '' WHERE phone IS NULL;
ALTER TABLE contact_forms ALTER COLUMN phone SET NOT NULL;

-- Step 5: Drop old name column
ALTER TABLE contact_forms DROP COLUMN name;

-- Step 6: Adjust field lengths
ALTER TABLE contact_forms
  ALTER COLUMN first_name TYPE VARCHAR(100),
  ALTER COLUMN last_name TYPE VARCHAR(100),
  ALTER COLUMN phone TYPE VARCHAR(50);
```

#### Devis Forms Migration

```sql
-- Step 1: Add new columns
ALTER TABLE devis_forms
  ADD COLUMN first_name VARCHAR(100),
  ADD COLUMN last_name VARCHAR(100),
  ADD COLUMN email VARCHAR(255),
  ADD COLUMN phone VARCHAR(50),
  ADD COLUMN company VARCHAR(255),
  ADD COLUMN description TEXT,
  ADD COLUMN budget VARCHAR(100),
  ADD COLUMN quantity INTEGER,
  ADD COLUMN desired_delivery_date DATE;

-- Step 2: Migrate existing data from JSONB contact field
UPDATE devis_forms
SET 
  first_name = SPLIT_PART(contact->>'name', ' ', 1),
  last_name = SPLIT_PART(contact->>'name', ' ', 2),
  email = contact->>'email',
  phone = COALESCE(contact->>'phone', ''),
  company = 'N/A',  -- Default for existing records
  description = COALESCE(additional_info, '');

-- Step 3: Make required fields NOT NULL
ALTER TABLE devis_forms
  ALTER COLUMN first_name SET NOT NULL,
  ALTER COLUMN last_name SET NOT NULL,
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN phone SET NOT NULL,
  ALTER COLUMN company SET NOT NULL,
  ALTER COLUMN description SET NOT NULL;

-- Step 4: Drop old columns
ALTER TABLE devis_forms
  DROP COLUMN contact,
  DROP COLUMN additional_info,
  DROP COLUMN materials,
  DROP COLUMN colors;
```

---

## 🗃️ Data Migration Considerations

### Existing Contact Forms
- `name` must be split into `firstName` and `lastName`
- If `name` has only one word, use it for both fields
- `phone` NULL values must be handled (set default or delete records)
- `company` will be NULL for existing records (acceptable)

### Existing Devis Forms
- Extract `name`, `email`, `phone` from `contact` JSONB
- Split `name` into `firstName` and `lastName`
- `company` must have a default for existing records (e.g., "N/A")
- `description` maps from `additionalInfo`
- `budget`, `quantity`, `desiredDeliveryDate` will be NULL (acceptable)
- `materials` and `colors` data will be lost (remove if not needed)

---

## 🧪 Testing After Migration

### 1. Verify Schema
```sql
-- Check contact_forms structure
\d contact_forms

-- Check devis_forms structure
\d devis_forms

-- Verify data migrated
SELECT first_name, last_name, company FROM contact_forms LIMIT 5;
SELECT first_name, last_name, company, description FROM devis_forms LIMIT 5;
```

### 2. Test Forms via API

**Test Contact Form**:
```bash
curl -X POST http://localhost:3000/api/v1/forms/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "0612345678",
    "message": "Test message after migration",
    "acceptTerms": true
  }'
```

**Test Devis Form**:
```bash
curl -X POST http://localhost:3000/api/v1/forms/devis \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "0612345678",
    "company": "Test Company",
    "projectType": "Display",
    "description": "Test project after migration",
    "acceptTerms": true
  }'
```

### 3. Verify in Dashboard

1. Login to admin dashboard
2. Navigate to Forms section
3. Check that old and new submissions display correctly
4. Verify all fields are visible

---

## 🔄 Rollback Plan

If migration fails or causes issues:

### Quick Rollback (if migrations used)
```bash
npm run typeorm migration:revert
```

### Manual Rollback
```sql
-- Restore contact_forms
ALTER TABLE contact_forms
  ADD COLUMN name VARCHAR(255);

UPDATE contact_forms
SET name = first_name || ' ' || last_name;

ALTER TABLE contact_forms
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN phone DROP NOT NULL,
  DROP COLUMN first_name,
  DROP COLUMN last_name,
  DROP COLUMN company;

-- Restore devis_forms
ALTER TABLE devis_forms
  ADD COLUMN contact JSONB,
  ADD COLUMN additional_info TEXT,
  ADD COLUMN materials TEXT[],
  ADD COLUMN colors TEXT[];

UPDATE devis_forms
SET 
  contact = jsonb_build_object(
    'name', first_name || ' ' || last_name,
    'email', email,
    'phone', phone
  ),
  additional_info = description;

ALTER TABLE devis_forms
  DROP COLUMN first_name,
  DROP COLUMN last_name,
  DROP COLUMN email,
  DROP COLUMN phone,
  DROP COLUMN company,
  DROP COLUMN description,
  DROP COLUMN budget,
  DROP COLUMN quantity,
  DROP COLUMN desired_delivery_date;
```

---

## 📋 Migration Checklist

### Pre-Migration
- [ ] Backup database: `pg_dump multipoles > backup_$(date +%Y%m%d).sql`
- [ ] Document current record counts
- [ ] Test migration on development/staging first
- [ ] Notify team of planned downtime

### During Migration
- [ ] Stop application/API
- [ ] Run migration script
- [ ] Verify schema changes
- [ ] Check data integrity
- [ ] Test sample queries

### Post-Migration
- [ ] Start application
- [ ] Test all form endpoints
- [ ] Submit test contact form
- [ ] Submit test devis form
- [ ] Check emails are sent
- [ ] Verify dashboard displays correctly
- [ ] Monitor logs for errors

---

## 🐛 Common Issues

### Issue: Migration fails with NULL constraint violation
**Solution**: Update NULL values before making columns NOT NULL
```sql
UPDATE contact_forms SET phone = '' WHERE phone IS NULL;
```

### Issue: Name split doesn't work for some records
**Solution**: Handle edge cases
```sql
UPDATE contact_forms
SET 
  first_name = COALESCE(SPLIT_PART(name, ' ', 1), name),
  last_name = COALESCE(NULLIF(SPLIT_PART(name, ' ', 2), ''), SPLIT_PART(name, ' ', 1));
```

### Issue: TypeORM synchronize drops data
**Solution**: NEVER use synchronize in production. Always use migrations.

---

## 📞 Need Help?

If migration fails:
1. Restore from backup
2. Check error logs
3. Verify PostgreSQL version compatibility
4. Test migration on copy of production data
5. Contact DevOps team if needed

---

**Status**: Migration required before frontend integration
