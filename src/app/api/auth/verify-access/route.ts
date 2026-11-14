import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const login = (body.login || body.email || '').toLowerCase().trim();
    const password = (body.password || '').trim();

    if (!login) {
      return NextResponse.json({
        authorized: false,
        message: 'Por favor, informe seu e-mail ou usuário cadastrado.',
      }, { status: 400 });
    }

    // 1. Acesso Especial para o Compliance da Ticto
    // Aceita tanto pelo e-mail quanto pelo usuário simples "ticto"
    if (
      login === 'ticto@nutridebolso.app' ||
      login === 'ticto' ||
      login === 'compliance@ticto.com.br' ||
      login === 'avaliador' ||
      login === 'avaliador@ticto.com'
    ) {
      return NextResponse.json({
        authorized: true,
        role: 'reviewer',
        name: 'Avaliador Ticto',
        email: 'ticto@nutridebolso.app',
      });
    }

    // 2. Acesso Mestre do Administrador e VIPs Liberados Manualmente
    const adminEmails = [
      'jonnssonmkt@gmail.com',
      (process.env.ADMIN_EMAIL || '').toLowerCase().trim(),
    ].filter(Boolean);

    const authorizedVips: Record<string, string> = {
      'rodrigocruz00@gmail.com': 'Rodrigo Cruz',
    };

    if (adminEmails.includes(login)) {
      return NextResponse.json({
        authorized: true,
        role: 'admin',
        name: 'Administrador',
        email: login,
      });
    }

    if (authorizedVips[login]) {
      return NextResponse.json({
        authorized: true,
        role: 'vip',
        name: authorizedVips[login],
        email: login,
      });
    }

    // 3. Consulta no Upstash Redis para alunos compradores
    const redis = getRedisClient();
    let userData: any = null;

    if (redis) {
      try {
        userData = await redis.get(`user:${login}`);
        if (!userData) {
          userData = await redis.get(`ticto:user:${login}`);
        }
        if (!userData) {
          userData = await redis.get(`kiwify:user:${login}`);
        }
      } catch (redisErr) {
        console.warn('Erro ao consultar Upstash Redis:', redisErr);
      }
    }

    if (!userData) {
      return NextResponse.json({
        authorized: false,
        reason: 'not_found',
        message: 'Nenhuma compra aprovada encontrada para este e-mail. Adquira sua licença oficial na Ticto.',
      });
    }

    const parsed = typeof userData === 'string' ? JSON.parse(userData) : userData;

    if (parsed.status === 'active') {
      return NextResponse.json({
        authorized: true,
        role: 'customer',
        name: parsed.name || 'Aluno Oficial',
        email: login,
      });
    }

    if (parsed.status === 'refunded') {
      return NextResponse.json({
        authorized: false,
        reason: 'refunded',
        message: 'Seu acesso foi revogado devido a estorno ou cancelamento do pedido.',
      });
    }

    return NextResponse.json({
      authorized: false,
      reason: 'inactive',
      message: 'Sua assinatura ou acesso não está ativo no momento.',
    });
  } catch (error: any) {
    console.error('[Verify Access Error]:', error);
    return NextResponse.json({
      authorized: false,
      message: 'Erro interno ao validar acesso.',
      detail: String(error?.message || error),
    }, { status: 500 });
  }
}
