import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ELogLevels } from '@/constants/logs';
import { sendLog } from '@/utils/logs';

// Configure Cloudinary with server-side credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Rate limiting configuration
const RATE_LIMIT = 10; // requests per minute
const rateLimit = new Map<string, { count: number; timestamp: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimit.get(ip);

  if (!userLimit) {
    rateLimit.set(ip, { count: 1, timestamp: now });
    return false;
  }

  // Reset if a minute has passed
  if (now - userLimit.timestamp > 60000) {
    rateLimit.set(ip, { count: 1, timestamp: now });
    return false;
  }

  // Check if user has exceeded rate limit
  if (userLimit.count >= RATE_LIMIT) {
    return true;
  }

  userLimit.count += 1;
  return false;
}

// Helper function to check authentication
async function checkAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized - Please sign in' }, { status: 401 });
  }

  return null; // null means auth is successful
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication first
    const authError = await checkAuth();
    if (authError) return authError;

    const ip = request.ip ?? 'unknown';

    // Rate limiting check
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const filename = formData.get('filename') as string;

    if (!file || !filename) {
      return NextResponse.json({ error: 'File and filename are required' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Validate file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            public_id: filename,
            folder: 'interview-room',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    sendLog({
      err: error as Error,
      level: ELogLevels.Error,
      message: 'Error in Cloudinary upload',
    });
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication first
    const authError = await checkAuth();
    if (authError) return authError;

    const ip = request.ip ?? 'unknown';

    // Rate limiting check
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }

    await cloudinary.uploader.destroy(publicId);
    return NextResponse.json({ success: true });
  } catch (error) {
    sendLog({
      err: error as Error,
      level: ELogLevels.Error,
      message: 'Error in Cloudinary delete',
    });
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
