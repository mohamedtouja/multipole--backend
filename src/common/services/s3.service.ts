import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('S3_ENDPOINT');
    const region = this.configService.get<string>('S3_REGION') || 'gra';
    
    this.s3Client = new S3Client({
      region: region,
      endpoint: endpoint,
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY_ID') || '',
        secretAccessKey:
          this.configService.get<string>('S3_SECRET_ACCESS_KEY') || '',
      },
      forcePathStyle: true, // Required for OVH and other S3-compatible services
    });
    this.bucket =
      this.configService.get<string>('S3_BUCKET') || 'multipoles-assets';
    
    // Public URL for accessing files - OVH format or custom CDN
    this.publicUrl = this.configService.get<string>('S3_PUBLIC_URL') || 
      `https://${this.bucket}.${region}.cloud.ovh.net`;
  }

  async uploadFile(
    file: Buffer,
    folder: string,
    filename?: string,
  ): Promise<string> {
    const key = `${folder}/${filename || uuidv4()}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ACL: 'public-read', // Make uploaded files publicly accessible
    });

    await this.s3Client.send(command);
    return `${this.publicUrl}/${key}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const key = this.extractKeyFromUrl(fileUrl);
    if (!key) return;

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  async getPresignedUploadUrl(
    folder: string,
    filename: string,
    expiresIn = 3600,
  ): Promise<{ uploadUrl: string; fileUrl: string; key: string }> {
    const key = `${folder}/${filename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ACL: 'public-read', // Make uploaded files publicly accessible
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
    const fileUrl = `${this.publicUrl}/${key}`;

    return {
      uploadUrl,
      fileUrl,
      key,
    };
  }

  async getPresignedDownloadUrl(
    fileUrl: string,
    expiresIn = 3600,
  ): Promise<string> {
    const key = this.extractKeyFromUrl(fileUrl);
    if (!key) return fileUrl;

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  private extractKeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.substring(1); // Remove leading /
    } catch {
      return null;
    }
  }
}
