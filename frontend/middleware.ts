import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  // Lista de rotas que não requerem autenticação
  const publicRoutes = ['/login', '/register', '/'];
  
  // Se a rota atual é pública, permite o acesso
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (!token) {
    // Redireciona para a página de login se não houver token
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verifica se o token é válido
    verify(token, process.env.JWT_SECRET || '');
    return NextResponse.next();
  } catch (error) {
    // Se o token for inválido, redireciona para o login
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