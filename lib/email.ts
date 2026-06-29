import { Resend } from 'resend';
import { createServiceClient } from './supabase-server';
import { OrderItem } from './types';
import { sendTelegramNotification } from './telegram';

const WHATSAPP_NUMBER = '393511660891';
const WHATSAPP_DISPLAY = '+39 351 166 0891';

export async function sendOrderConfirmationEmail(orderId: string) {
  try {
    const supabase = createServiceClient();
    
    // Fetch the complete order details
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      console.error('Email Sender: Order not found', error);
      return false;
    }

    const email = order.customer_email;
    if (!email) {
      console.warn(`Email Sender: No customer email for order ${orderId}`);
      return false;
    }

    const name = order.customer_name || 'Cliente';
    const isMaisonelle = order.store_id === 'store-c';
    
    const maisonelleKey = process.env.RESEND_API_KEY_MAISONELLE || process.env.RESEND_API_KEY_VELAN;
    const aurelioKey = process.env.RESEND_API_KEY_AURELIO;
    
    console.log(`Email Sender: Sending email for store ${order.store_id}. Maisonelle key configured: ${!!maisonelleKey}, Aurelio key configured: ${!!aurelioKey}`);
    
    const resendClient = isMaisonelle 
      ? new Resend(maisonelleKey) 
      : new Resend(aurelioKey);
      
    const fromAddress = isMaisonelle ? 'Maisonelle <info@maisonelle.com>' : 'Aurelio <info@arealusso.com>';
    const storeName = isMaisonelle ? 'Maisonelle' : 'Aurelio';
    
    // Create a simple HTML template for the receipt
    const itemsHtml = (order.order_items as OrderItem[]).map((item: OrderItem) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.product_name}</strong><br/>
          <span style="color: #666; font-size: 12px;">Taglia: ${item.size || 'Unica'} | Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          €${Number(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('');

    const whatsappMessage = `Ciao, ho appena effettuato l'ordine #${order.order_number} su ${storeName}. Vorrei ricevere aggiornamenti sulla spedizione.`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    const whatsappGeneralUrl = `https://wa.me/${WHATSAPP_NUMBER}`;
    const whatsappQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(whatsappUrl)}`;

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="text-align: center; color: #000;">Grazie per il tuo ordine!</h2>
        <p>Ciao ${name},</p>
        <p>Abbiamo ricevuto il tuo ordine <strong>#${order.order_number}</strong> e stiamo preparando la spedizione.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #000;">Articolo</th>
              <th style="text-align: right; padding: 10px; border-bottom: 2px solid #000;">Totale</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 10px; text-align: right;"><strong>Spedizione:</strong></td>
              <td style="padding: 10px; text-align: right;">€${Number(order.shipping_cost || 0).toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; text-align: right; font-size: 18px;"><strong>Totale Pagato:</strong></td>
              <td style="padding: 10px; text-align: right; font-size: 18px;"><strong>€${Number(order.total).toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>

        <div style="margin-top: 32px; padding: 24px; background-color: #f9f9f9; border-radius: 8px; text-align: center;">
          <p style="margin: 0 0 8px; font-size: 14px; color: #333;"><strong>Hai domande?</strong></p>
          <p style="margin: 0 0 12px; font-size: 13px; color: #666; line-height: 1.5;">
            Contattaci su WhatsApp al
            <a href="${whatsappGeneralUrl}" style="color: #25D366; font-weight: bold; text-decoration: none;">${WHATSAPP_DISPLAY}</a>
            — siamo a tua disposizione per qualsiasi dubbio.
          </p>
          <p style="margin: 0 0 24px; font-size: 13px; color: #666; line-height: 1.5;">
            Per restare aggiornato sul tuo ordine <strong>#${order.order_number}</strong>, scrivici su WhatsApp: ti terremo informato su preparazione e spedizione.
          </p>

          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto 24px;">
            <tr>
              <td style="border-radius: 8px; background-color: #25D366;">
                <a href="${whatsappUrl}" target="_blank" style="display: inline-block; background-color: #25D366; border: 1px solid #25D366; font-family: sans-serif; font-size: 15px; font-weight: bold; line-height: 1; text-decoration: none; padding: 14px 32px; color: #ffffff; border-radius: 8px;">
                  Apri WhatsApp
                </a>
              </td>
            </tr>
          </table>

          <p style="margin: 0 0 12px; font-size: 12px; color: #888;">Oppure inquadra il QR code con il telefono:</p>
          <a href="${whatsappUrl}" target="_blank" style="display: inline-block; text-decoration: none;">
            <img src="${whatsappQrUrl}" alt="QR code WhatsApp ordine #${order.order_number}" width="180" height="180" style="display: block; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 8px;" />
          </a>
          <p style="margin: 12px 0 0; font-size: 11px; color: #aaa;">Il messaggio con il numero ordine sarà già compilato.</p>
        </div>

        <div style="margin-top: 32px; text-align: center; font-size: 12px; color: #999;">
          <p>Puoi anche rispondere direttamente a questa email.</p>
          <p>&copy; ${new Date().getFullYear()} ${storeName}. Tutti i diritti riservati.</p>
        </div>
      </div>
    `;

    const response = await resendClient.emails.send({
      from: fromAddress,
      to: [email],
      subject: `Conferma Ordine #${order.order_number} - ${storeName}`,
      html: htmlContent,
    });

    if (response.error) {
      console.error('Resend error:', response.error);
      return false;
    }

    console.log(`Email successfully sent for order ${orderId} via ${storeName}`);

    // Invia la notifica Telegram per l'ordine pagato
    try {
      const itemsText = (order.order_items as OrderItem[])
        .map((item: OrderItem) => `• <b>${item.product_name}</b> (Qty: ${item.quantity}, Taglia: ${item.size || 'Unica'}) - €${item.price}`)
        .join("\n");

      const tgMessage = `<b>✅ ORDINE PAGATO!</b>\n\n` +
        `<b>Store:</b> ${storeName}\n` +
        `<b>Ordine N.:</b> #<code>${order.order_number}</code>\n` +
        `<b>Cliente:</b> ${name}\n` +
        `<b>Email:</b> ${email}\n` +
        `<b>Totale Pagato:</b> €${Number(order.total).toFixed(2)}\n` +
        `<b>PayPal Order ID:</b> <code>${order.paypal_order_id || 'N/D'}</code>\n` +
        `<b>PayPal Capture ID:</b> <code>${order.paypal_capture_id || 'N/D'}</code>\n\n` +
        `<b>Articoli:</b>\n${itemsText}`;

      await sendTelegramNotification(tgMessage).catch(console.error);
    } catch (tgErr) {
      console.error('Telegram notification error in email helper:', tgErr);
    }

    return true;

  } catch (err) {
    console.error('Email Sender Error:', err);
    return false;
  }
}
