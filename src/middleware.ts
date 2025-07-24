import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export default auth((req) => {
  console.log('Middleware auth object:', req.auth);
  if (req.nextUrl.pathname.startsWith('/api/admin')) {
    if (!req.auth || req.auth.user?.role !== 'admin') {
      console.error('Unauthorized access to admin API', { user: req.auth?.user });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: ['/api/admin/:path*'],
}