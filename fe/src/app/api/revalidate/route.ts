import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return handleRevalidate(request);
}

export async function POST(request: NextRequest) {
  return handleRevalidate(request);
}

async function handleRevalidate(request: NextRequest) {
  try {
    const urlSecret = request.nextUrl.searchParams.get('secret');
    const urlPath = request.nextUrl.searchParams.get('path');
    const urlTag = request.nextUrl.searchParams.get('tag');

    let bodyData: any = {};
    if (request.method === 'POST') {
      bodyData = await request.json().catch(() => ({}));
    }

    const secret = urlSecret || bodyData?.secret;
    const path = urlPath || bodyData?.path || '/';
    const tag = urlTag || bodyData?.tag;

    const EXPECTED_SECRET = process.env.REVALIDATE_SECRET || 'dnf_revalidate_secret_2026';

    if (secret !== EXPECTED_SECRET) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    if (tag) {
      revalidateTag(tag);
    }

    if (path) {
      revalidatePath(path, 'layout');
    } else {
      revalidatePath('/', 'layout');
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      path,
      tag: tag || null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: 'Error revalidating', error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
