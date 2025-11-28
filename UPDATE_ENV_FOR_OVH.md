# Update .env File for OVH Object Storage

## The Problem
You're getting "Erreur upload: Une erreur est survenue" because your `.env` file still has old AWS variable names, but the code now expects new S3 variable names.

## Quick Fix

Open your `.env` file and **REPLACE** these old variables:

```env
# OLD - Remove these
AWS_REGION=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
```

**WITH** these new variables for OVH:

```env
# NEW - Add these
S3_ENDPOINT=https://s3.gra.cloud.ovh.net
S3_REGION=gra
S3_ACCESS_KEY_ID=your-ovh-access-key-here
S3_SECRET_ACCESS_KEY=your-ovh-secret-key-here
S3_BUCKET=multipoles-assets
```

## Step-by-Step:

### 1. Get OVH Credentials

If you don't have OVH Object Storage set up yet:
- Go to https://www.ovh.com/manager/
- Navigate to **Public Cloud** → **Object Storage**
- Create a public container named `multipoles-assets`
- Go to **Users & Roles** → Create S3 user
- Copy the **Access Key** and **Secret Key**

### 2. Edit .env File

```bash
# Open the .env file
notepad C:\Users\moham\OneDrive\Desktop\multipoles-backend\.env
```

### 3. Update Variables

Replace the AWS section with:

```env
# Object Storage (OVH Cloud)
S3_ENDPOINT=https://s3.gra.cloud.ovh.net
S3_REGION=gra
S3_ACCESS_KEY_ID=paste-your-access-key-here
S3_SECRET_ACCESS_KEY=paste-your-secret-key-here
S3_BUCKET=multipoles-assets
```

**Important**: Choose the correct region endpoint:
- GRA (France): `https://s3.gra.cloud.ovh.net`
- SBG (France): `https://s3.sbg.cloud.ovh.net`
- BHS (Canada): `https://s3.bhs.cloud.ovh.net`
- DE (Germany): `https://s3.de.cloud.ovh.net`

### 4. Restart Backend

```bash
cd C:\Users\moham\OneDrive\Desktop\multipoles
docker-compose restart backend
```

### 5. Test Upload

- Go to dashboard: http://localhost:3001
- Try uploading an image
- Should work now!

## If You Don't Have OVH Yet (Temporary Local Solution)

If you want to test without setting up OVH right now, you can use local file storage temporarily:

### Option A: Mock S3 with Fake Credentials (Not Recommended)
```env
S3_ENDPOINT=http://localhost:9000
S3_REGION=local
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_BUCKET=multipoles-assets
```

### Option B: Wait and Set Up OVH Properly (Recommended)
Follow the full guide in `OVH_OBJECT_STORAGE_SETUP.md` to set up real cloud storage.

## Verification

After restarting, check the logs:
```bash
docker logs multipoles-backend -f
```

Then try uploading - you should see S3 connection attempts in the logs.
