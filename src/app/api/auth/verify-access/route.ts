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
    // Login: ticto@nutridebolso.app | Senha: ticto@nutri2026
    // Ou usuário: ticto
    if (
      (login === 'ticto@nutridebolso.app' || login === 'ticto' || login === 'compliance@ticto.com.br') &&
      (password === 'ticto@nutri2026' || password === 'nutri2026' || password === 'ticto123')
    ) {
      return NextResponse.json({
        authorized: true,
        role: 'reviewer',
        name: 'Avaliador Ticto',
        email: 'ticto@nutridebolso.app',
      });
    }

    // 2. Acesso Mestre do Administrador / Criador (Sempre Liberado)
    const adminEmails = [
      'jonnssonmkt@gmail.com',
      (process.env.ADMIN_EMAIL || '').toLowerCase().trim(),
    ].filter(Boolean);

    if (adminEmails.includes(login)) {
      return NextResponse.json({
        authorized: true,
        role: 'admin',
        name: 'Administrador',
        email: login,
      });
    }

    // 3. Consulta no Upstash Redis para alunos compradores
    const redis = getRedisClient();
    if (!redis) {
      console.warn('Upstash Redis offline. Verifique as credenciais.');
      return NextResponse.json({
        authorized: false,
        message: 'Serviço de validação temporariamente indisponível. Tente novamente em instantes.',
      }, { status: 503 });
    }

    let userData = await redis.get<{
      email: string;
      name?: string;
      status: string;
      orderId?: string;
    } | string>(`user:${login}`);

    if (!userData) {
      userData = await redis.get(`ticto:user:${login}`);
    }

    if (!userData) {
      userData = await redis.get(`kiwify:user:${login}`);
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
  } catch (error) {
    console.error('[Verify Access Error]:', error);
    return NextResponse.json({
      authorized: false,
      message: 'Erro interno ao validar acesso.',
    }, { status: 500 });
  }
}
