import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

/**
 * Webhook Oficial para integração com a Kiwify.
 * Recebe notificações de compras, aprovações, estornos e cancelamentos.
 */
export async function POST(req: NextRequest) {
  try {
    const redis = getRedisClient();
    if (!redis) {
      console.error('[Kiwify Webhook] Redis não configurado.');
      return NextResponse.json({ error: 'Database indisponível' }, { status: 500 });
    }

    // Validação opcional de segurança com Token
    const webhookSecret = process.env.KIWIFY_WEBHOOK_SECRET;
    const tokenParam = req.nextUrl.searchParams.get('token');
    if (webhookSecret && tokenParam !== webhookSecret) {
      console.warn('[Kiwify Webhook] Token de webhook inválido.');
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();

    // Extrair status da compra
    // Kiwify envia order_status: 'paid', 'approved', 'refunded', 'chargedback', etc.
    const orderStatus = (body.order_status || body.status || '').toLowerCase();

    // Extrair dados do cliente
    const customer = body.Customer || body.customer || {};
    const email = (customer.email || body.email || '').toLowerCase().trim();
    const name = customer.full_name || customer.name || body.name || 'Cliente Kiwify';
    const orderId = body.order_id || body.order_ref || body.id || 'N/A';

    if (!email) {
      console.warn('[Kiwify Webhook] Requisição recebida sem e-mail do comprador.');
      return NextResponse.json({ error: 'E-mail ausente' }, { status: 400 });
    }

    console.log(`[Kiwify Webhook] Evento recebido: Status "${orderStatus}" para o e-mail: ${email}`);

    // Mapeamento dos status
    const isApproved = ['paid', 'approved', 'paid_order', 'complete'].includes(orderStatus);
    const isRevoked = ['refunded', 'chargedback', 'canceled', 'cancelled', 'refund'].includes(orderStatus);

    if (isApproved) {
      // Salva ou atualiza comprador como ATIVO no Redis
      await redis.set(
        `kiwify:user:${email}`,
        JSON.stringify({
          email,
          name,
          status: 'active',
          orderId,
          updatedAt: new Date().toISOString(),
        })
      );
      console.log(`[Kiwify Webhook] Acesso LIBERADO para ${email}`);
    } else if (isRevoked) {
      // Atualiza o comprador como REVOGADO no Redis
      await redis.set(
        `kiwify:user:${email}`,
        JSON.stringify({
          email,
          name,
          status: 'refunded',
          orderId,
          updatedAt: new Date().toISOString(),
        })
      );
      console.log(`[Kiwify Webhook] Acesso REVOGADO para ${email}`);
    } else {
      console.log(`[Kiwify Webhook] Status ignorado: "${orderStatus}"`);
    }

    return NextResponse.json({
      received: true,
      email,
      orderStatus,
      status: isApproved ? 'active' : isRevoked ? 'refunded' : 'ignored',
    });
  } catch (error) {
    console.error('[Kiwify Webhook Error]:', error);
    return NextResponse.json({ error: 'Erro interno ao processar webhook' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Kiwify Webhook Listener',
    version: '1.0.0',
  });
}
