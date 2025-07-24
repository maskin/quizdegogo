import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export default auth((req) => {
  if (req.nextUrl.pathname.startsWith('/api/admin')) {
    if (!req.auth || req.auth.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: ['/api/admin/:path*'],
}