import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return handleRevalidate(request);
}

export async function POST(request: NextRequest) {
  return handleRevalidate(request);
}

async function handleRevalidate(request: NextRequest) {
  const startTime = Date.now();

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
    const tag = urlTag || bodyData?.tag || 'cms-data';

    const EXPECTED_SECRET = process.env.REVALIDATE_SECRET || 'dnf_revalidate_secret_2026';

    if (secret !== EXPECTED_SECRET) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const purged: string[] = [];

    // 1. LUÔN purge tag 'cms-data' trước — xóa toàn bộ Data Cache trong Next.js
    (revalidateTag as any)('cms-data');
    purged.push('tag:cms-data');

    // 2. Nếu có tag tùy chỉnh khác, purge thêm
    if (tag && tag !== 'cms-data') {
      (revalidateTag as any)(tag);
      purged.push(`tag:${tag}`);
    }

    // 3. Revalidate path cụ thể (nếu có)
    if (path && path !== '/') {
      revalidatePath(path, 'layout');
      purged.push(`path:${path}`);
    }

    // 4. LUÔN revalidate root layout — purge toàn bộ Vercel Edge Cache
    revalidatePath('/', 'layout');
    purged.push('path:/');

    const elapsed = Date.now() - startTime;

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      elapsed_ms: elapsed,
      path,
      tag,
      purged,
    });
  } catch (err: any) {
    const elapsed = Date.now() - startTime;
    return NextResponse.json(
      { 
        message: 'Error revalidating', 
        error: err?.message || String(err),
        elapsed_ms: elapsed,
      },
      { status: 500 }
    );
  }
}
