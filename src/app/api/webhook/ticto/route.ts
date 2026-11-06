import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

/**
 * Webhook Oficial para integração com a plataforma Ticto.
 * Recebe notificações de compras, aprovações, estornos e cancelamentos.
 * 
 * Eventos da Ticto:
 * - order_approved / authorized / paid: Libera o acesso do cliente
 * - chargeback / refunded / canceled: Revoga o acesso do cliente
 */
export async function POST(req: NextRequest) {
  try {
    const redis = getRedisClient();
    if (!redis) {
      console.error('[Ticto Webhook] Redis não configurado.');
      return NextResponse.json({ error: 'Database indisponível' }, { status: 500 });
    }

    // Validação opcional de segurança com Token da Ticto
    const webhookSecret = process.env.TICTO_WEBHOOK_SECRET;
    const tokenParam = req.nextUrl.searchParams.get('token');
    const headerToken = req.headers.get('x-ticto-token') || req.headers.get('authorization');

    if (webhookSecret && tokenParam !== webhookSecret && headerToken !== webhookSecret) {
      console.warn('[Ticto Webhook] Token de webhook inválido.');
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Alguns testes da Ticto enviam body vazio ou urlencoded
      return NextResponse.json({ received: true, message: 'Ping de teste recebido com sucesso' });
    }

    // A Ticto envia os dados no padrão:
    // status: 'paid' | 'approved' | 'completed' | 'refunded' | 'chargeback' | etc.
    // ou event: 'order_approved', 'order_refunded'
    const statusRaw = (
      body.status ||
      body.order_status ||
      body.event ||
      body.data?.status ||
      body.data?.order_status ||
      ''
    ).toLowerCase();

    // Extrair dados do cliente
    const customer = body.customer || body.Customer || body.data?.customer || {};
    const email = (
      customer.email ||
      body.email ||
      body.data?.email ||
      ''
    ).toLowerCase().trim();

    const name =
      customer.name ||
      customer.full_name ||
      body.name ||
      body.data?.name ||
      'Cliente Ticto';

    const orderId =
      body.order_id ||
      body.order_hash ||
      body.id ||
      body.data?.order_id ||
      'N/A';

    // Se for um teste de webhook da Ticto sem e-mail
    if (!email) {
      console.log('[Ticto Webhook] Teste de conectividade / ping da Ticto recebido com sucesso.');
      return NextResponse.json({
        received: true,
        message: 'Webhook Ticto configurado e respondendo perfeitamente (HTTP 200).',
      });
    }

    console.log(`[Ticto Webhook] Evento recebido: Status "${statusRaw}" para o e-mail: ${email}`);

    // Mapeamento dos status de aprovação e cancelamento da Ticto
    const isApproved = [
      'paid',
      'approved',
      'authorized',
      'completed',
      'order_approved',
      'order_paid',
    ].some((s) => statusRaw.includes(s));

    const isRevoked = [
      'refunded',
      'chargedback',
      'chargeback',
      'canceled',
      'cancelled',
      'order_refunded',
      'order_chargeback',
    ].some((s) => statusRaw.includes(s));

    const userData = {
      email,
      name,
      platform: 'ticto',
      status: isApproved ? 'active' : isRevoked ? 'refunded' : 'pending',
      orderId,
      updatedAt: new Date().toISOString(),
    };

    if (isApproved) {
      // Salva tanto na chave geral de usuário quanto na específica da Ticto
      await Promise.all([
        redis.set(`user:${email}`, JSON.stringify(userData)),
        redis.set(`ticto:user:${email}`, JSON.stringify(userData)),
      ]);
      console.log(`[Ticto Webhook] Acesso LIBERADO para ${email}`);
    } else if (isRevoked) {
      await Promise.all([
        redis.set(`user:${email}`, JSON.stringify(userData)),
        redis.set(`ticto:user:${email}`, JSON.stringify(userData)),
      ]);
      console.log(`[Ticto Webhook] Acesso REVOGADO para ${email}`);
    } else {
      console.log(`[Ticto Webhook] Status pendente ou ignorado: "${statusRaw}"`);
    }

    return NextResponse.json({
      received: true,
      email,
      status: isApproved ? 'active' : isRevoked ? 'refunded' : 'ignored',
    });
  } catch (error) {
    console.error('[Ticto Webhook Error]:', error);
    return NextResponse.json({ error: 'Erro interno ao processar webhook' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Ticto Webhook Listener (Nutri de Bolso)',
    endpoint: '/api/webhook/ticto',
    version: '1.0.0',
  });
}
