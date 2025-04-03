import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  // Não intercepta requisições de API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  // Lista de rotas que não requerem autenticação
  const publicRoutes = ['/', '/login', '/register'];
  
  // Se a rota atual é pública, permite o acesso
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    // Se o usuário está autenticado e tenta acessar login/registro, redireciona para o dashboard
    if (token && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Para rotas protegidas, verifica o token
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    verify(token, process.env.JWT_SECRET || '');
    return NextResponse.next();
  } catch (error) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/documents/:path*',
    '/login',
    '/register',
  ],
}; 