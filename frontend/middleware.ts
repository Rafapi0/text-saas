import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Lista de rotas que requerem autenticação
  const protectedRoutes = ['/dashboard', '/profile', '/documents'];

  // Verifica se a rota atual requer autenticação
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!token) {
      // Redireciona para a página de login se não houver token
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verifica se o token é válido
      verify(token, process.env.JWT_SECRET || '');
      return NextResponse.next();
    } catch (error) {
      // Se o token for inválido, redireciona para o login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/documents/:path*',
  ],
}; 