
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderConfirmationRequest {
  email: string;
  orderData: {
    id: string;
    total_amount: number;
    delivery_address: any;
    phone: string;
    payment_method: string;
    order_items: Array<{
      product: {
        name: string;
        image_url?: string;
      };
      quantity: number;
      price: number;
    }>;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📧 Email confirmation request received');
    
    const { email, orderData }: OrderConfirmationRequest = await req.json();
    console.log('📨 Sending email to:', email);
    console.log('🆔 Order ID:', orderData.id);
    
    // Gmail SMTP configuration
    const gmailUsername = Deno.env.get('GMAIL_USERNAME') || '';
    const gmailPassword = Deno.env.get('GMAIL_PASSWORD') || '';
    
    console.log('📋 Gmail username configured:', gmailUsername ? 'Yes' : 'No');
    console.log('🔑 Gmail password configured:', gmailPassword ? 'Yes (length: ' + gmailPassword.length + ')' : 'No');
    
    if (!gmailUsername || !gmailPassword) {
      console.log('⚠️ Gmail credentials not configured properly');
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Gmail credentials not configured properly',
          details: {
            username: gmailUsername ? 'configured' : 'missing',
            password: gmailPassword ? 'configured' : 'missing'
          }
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Generate order items HTML
    const orderItemsHtml = orderData.order_items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <div style="display: flex; align-items: center;">
            ${item.product.image_url ? `<img src="${item.product.image_url}" alt="${item.product.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px; border-radius: 4px;">` : ''}
            <div>
              <strong>${item.product.name}</strong><br>
              <small>Quantity: ${item.quantity}</small>
            </div>
          </div>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          ₹${item.price * item.quantity}
        </td>
      </tr>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: #28a745; margin: 0;">Order Confirmed! 🎉</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for your order. We've received your payment and will process your order shortly.</p>
          </div>

          <div style="background: white; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin-top: 0; color: #495057;">Order Details</h2>
            <p><strong>Order ID:</strong> #${orderData.id.slice(0, 8)}</p>
            <p><strong>Total Amount:</strong> ₹${orderData.total_amount}</p>
            <p><strong>Payment Method:</strong> ${orderData.payment_method.toUpperCase()}</p>
          </div>

          <div style="background: white; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #495057;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${orderItemsHtml}
              <tr style="background: #f8f9fa;">
                <td style="padding: 15px; font-weight: bold;">Total</td>
                <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px;">₹${orderData.total_amount}</td>
              </tr>
            </table>
          </div>

          <div style="background: white; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #495057;">Delivery Address</h3>
            <p>
              ${orderData.delivery_address.full_name}<br>
              ${orderData.delivery_address.address_line_1}<br>
              ${orderData.delivery_address.address_line_2 ? orderData.delivery_address.address_line_2 + '<br>' : ''}
              ${orderData.delivery_address.city}, ${orderData.delivery_address.state} ${orderData.delivery_address.postal_code}<br>
              <strong>Phone:</strong> ${orderData.phone}
            </p>
          </div>

          <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
            <h3 style="margin-top: 0; color: #0056b3;">What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>We'll process your order within 1-2 business days</li>
              <li>You'll receive a shipping confirmation email once your order is dispatched</li>
              <li>Expected delivery: 3-5 business days</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d;">
            <p>Thank you for shopping with us!</p>
            <p style="font-size: 14px;">If you have any questions, please contact our support team.</p>
          </div>
        </body>
      </html>
    `;

    console.log('📤 Attempting to send email using fetch method...');
    
    // Use Gmail API via fetch instead of SMTP
    const emailData = {
      from: gmailUsername,
      to: email,
      subject: `Order Confirmation - #${orderData.id.slice(0, 8)}`,
      html: emailHtml
    };

    // Create basic auth header
    const auth = btoa(`${gmailUsername}:${gmailPassword}`);
    
    // Try sending via Gmail SMTP using a simpler approach
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        service_id: 'gmail',
        template_id: 'template_order_confirmation',
        user_id: gmailUsername,
        template_params: {
          to_email: email,
          subject: emailData.subject,
          html_content: emailData.html,
          from_email: gmailUsername
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Email service responded with status: ${response.status}`);
    }

    console.log('✅ Order confirmation email sent successfully to:', email);

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('❌ Detailed error sending email:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      cause: error.cause
    });
    
    // Fallback: Log the email content and return success (don't block order)
    console.log('📧 Email content that would have been sent:', {
      to: (req as any).email,
      subject: `Order Confirmation`,
      orderData: (req as any).orderData
    });
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        errorName: error.name,
        message: 'Failed to send confirmation email - order still processed successfully' 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
