import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || '').toLowerCase().trim();

    if (!email || !email.includes('@')) {
      return NextResponse.json({
        authorized: false,
        message: 'Por favor, informe um endereço de e-mail válido.',
      }, { status: 400 });
    }

    // 1. Acesso Mestre do Administrador / Criador (Sempre Liberado)
    const adminEmails = [
      'jonnssonmkt@gmail.com',
      (process.env.ADMIN_EMAIL || '').toLowerCase().trim(),
    ].filter(Boolean);

    if (adminEmails.includes(email)) {
      return NextResponse.json({
        authorized: true,
        role: 'admin',
        name: 'Administrador',
        email,
      });
    }

    // 2. Consulta no Upstash Redis
    const redis = getRedisClient();
    if (!redis) {
      console.warn('Upstash Redis offline. Verifique as credenciais.');
      return NextResponse.json({
        authorized: false,
        message: 'Serviço de validação temporariamente indisponível. Tente novamente em instantes.',
      }, { status: 503 });
    }

    // Busca nas chaves: geral, Ticto e Kiwify
    let userData = await redis.get<{
      email: string;
      name?: string;
      status: string;
      orderId?: string;
    } | string>(`user:${email}`);

    if (!userData) {
      userData = await redis.get(`ticto:user:${email}`);
    }

    if (!userData) {
      userData = await redis.get(`kiwify:user:${email}`);
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
        email,
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
  } catch (error) {
    console.error('[Verify Access Error]:', error);
    return NextResponse.json({
      authorized: false,
      message: 'Erro interno ao validar acesso.',
    }, { status: 500 });
  }
}
