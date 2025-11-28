# OVH Cloud Object Storage Configuration for Multi-Pôles

## Overview
This guide explains how to configure OVH Cloud Object Storage for image uploads in the Multi-Pôles application.

## Step 1: Create OVH Object Storage Container

### 1. Log in to OVH Manager
- Go to https://www.ovh.com/manager/
- Navigate to **Public Cloud** → **Object Storage**

### 2. Create a New Container
- Click **"Create a container"**
- Select your project
- Choose a **region** (e.g., GRA - Gravelines, SBG - Strasbourg)
- Enter container name: `multipoles-assets` (or your preferred name)
- Select **"Public"** access type (important for images to be accessible)
- Click **Create**

### 3. Get Your S3 Credentials

#### Create S3 User:
- In OVH Manager, go to **Public Cloud** → **Users & Roles**
- Click **"Create User"** or use existing user
- Select **"S3"** role
- Download or note the credentials:
  - **Access Key ID**
  - **Secret Access Key**

#### Get Endpoint URL:
- Based on your region:
  - **GRA (Gravelines)**: `https://s3.gra.cloud.ovh.net`
  - **SBG (Strasbourg)**: `https://s3.sbg.cloud.ovh.net`
  - **BHS (Beauharnois)**: `https://s3.bhs.cloud.ovh.net`
  - **DE (Frankfurt)**: `https://s3.de.cloud.ovh.net`
  - **UK (London)**: `https://s3.uk.cloud.ovh.net`
  - **WAW (Warsaw)**: `https://s3.waw.cloud.ovh.net`

## Step 2: Configure Environment Variables

Update your `.env` file with the OVH credentials:

```env
# Object Storage (OVH Cloud)
S3_ENDPOINT=https://s3.gra.cloud.ovh.net
S3_REGION=gra
S3_ACCESS_KEY_ID=your-access-key-here
S3_SECRET_ACCESS_KEY=your-secret-key-here
S3_BUCKET=multipoles-assets
```

**Optional - Custom Public URL:**
If you want to use a custom domain or CDN:
```env
S3_PUBLIC_URL=https://cdn.yourdomain.com
```

## Step 3: Set Container Permissions

### Make Container Public:
1. In OVH Manager, go to your container
2. Click on **"Permissions"** or **"Access Control"**
3. Ensure the container is set to **"Public"**
4. This allows uploaded images to be accessible via public URLs

### Container Policy (Optional):
For more granular control, you can set a bucket policy:

```json
{
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::multipoles-assets/*"
    }
  ]
}
```

## Step 4: Configure CORS (If Needed)

If you need to upload files directly from the browser:

1. In OVH Manager, go to your container
2. Find **"CORS Configuration"** section
3. Add the following CORS rules:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:3001",
      "http://localhost:3002",
      "https://yourdomain.com",
      "https://dashboard.yourdomain.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## Step 5: Test the Configuration

### 1. Rebuild Backend:
```bash
cd multipoles
docker-compose build backend
docker-compose up -d backend
```

### 2. Upload Test Image:
- Go to dashboard: http://localhost:3001
- Try uploading an image in any module (Réalisations, Blog, etc.)

### 3. Verify URL:
The uploaded image URL should look like:
```
https://multipoles-assets.gra.cloud.ovh.net/folder/filename.jpg
```

### 4. Test Public Access:
- Copy the image URL
- Open it directly in a new browser tab
- The image should display without errors

### 5. Check Public Website:
- Go to: http://localhost:3002
- Navigate to pages with images (realisations, blog, etc.)
- Images should load correctly

## Troubleshooting

### Images not uploading:
✅ **Check credentials**: Verify `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY` in `.env`  
✅ **Check endpoint**: Ensure `S3_ENDPOINT` matches your region  
✅ **Check bucket name**: Verify `S3_BUCKET` matches your container name  
✅ **View logs**: `docker logs multipoles-backend -f`

### Images not displaying:
✅ **Container is public**: Check OVH Manager → Container → Permissions  
✅ **Test URL directly**: Copy image URL and open in browser  
✅ **Check CORS**: If uploading from browser, ensure CORS is configured  
✅ **Check public URL format**: Should be `https://[bucket].[region].cloud.ovh.net/[path]`

### Connection errors:
✅ **Firewall**: Ensure port 443 (HTTPS) is not blocked  
✅ **Endpoint reachable**: Test endpoint with curl: `curl https://s3.gra.cloud.ovh.net`  
✅ **Credentials valid**: Verify in OVH Manager that user has S3 access

## OVH Object Storage vs AWS S3

The Multi-Pôles backend uses the AWS SDK, which is fully compatible with OVH Object Storage because OVH implements the S3 API. Key differences:

- **Endpoint**: OVH uses `s3.[region].cloud.ovh.net` instead of AWS endpoints
- **Regions**: OVH uses codes like `gra`, `sbg` instead of AWS regions
- **Pricing**: OVH typically has different pricing structure
- **Performance**: Choose a region close to your users/servers

## Cost Optimization

### OVH Object Storage Pricing (approximate):
- **Storage**: ~€0.01/GB/month
- **Outbound traffic**: First 1TB often free, then ~€0.01/GB
- **Requests**: Very low cost per request

### Tips:
1. **Enable caching**: Use CDN or browser caching for frequently accessed images
2. **Optimize images**: Resize/compress images before upload
3. **Monitor usage**: Check OVH billing dashboard regularly
4. **Set lifecycle policies**: Auto-delete old/unused files

## Production Deployment

### Recommended Setup:
1. **Use CDN**: Configure OVH CDN or Cloudflare in front of Object Storage
2. **Custom domain**: Set up `cdn.yourdomain.com` pointing to your bucket
3. **Enable HTTPS**: Ensure all access is over HTTPS
4. **Backup important files**: Set up replication or backups
5. **Monitor**: Set up alerts for storage quota and traffic

### Environment Variables for Production:
```env
S3_ENDPOINT=https://s3.gra.cloud.ovh.net
S3_REGION=gra
S3_ACCESS_KEY_ID=prod-access-key
S3_SECRET_ACCESS_KEY=prod-secret-key
S3_BUCKET=multipoles-prod-assets
S3_PUBLIC_URL=https://cdn.yourdomain.com
```

## Support

- **OVH Documentation**: https://docs.ovh.com/gb/en/storage/pcs/
- **OVH Support**: https://www.ovh.com/manager/dedicated/#/support
- **Community**: https://community.ovh.com/

## Alternative: Local File Storage

If you want to avoid cloud storage during development, you can implement local file storage:

1. Save files to `backend/public/uploads/` directory
2. Serve static files through NestJS
3. Use URLs like `http://localhost:3000/uploads/folder/filename.jpg`

**Note**: Local storage is not recommended for production - use OVH Object Storage for scalability and reliability.
