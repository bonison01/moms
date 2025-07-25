import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdminNotificationRequest {
  type: string;
  title: string;
  message: string;
  adminEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, title, message, adminEmail }: AdminNotificationRequest = await req.json();
    
    console.log('Sending admin notification email:', { type, title, adminEmail });

    const gmailUsername = Deno.env.get('GMAIL_USERNAME');
    const gmailPassword = Deno.env.get('GMAIL_PASSWORD');

    if (!gmailUsername || !gmailPassword) {
      console.error('Gmail credentials not found');
      throw new Error('Gmail credentials not configured');
    }

    // Create email content
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Admin Notification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .notification-type { 
              display: inline-block; 
              padding: 4px 12px; 
              border-radius: 20px; 
              font-size: 12px; 
              font-weight: bold; 
              text-transform: uppercase;
              background-color: #e3f2fd;
              color: #1976d2;
            }
            .message { background-color: #ffffff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; }
            .footer { margin-top: 20px; padding: 20px; background-color: #f5f5f5; border-radius: 8px; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Admin Notification</h1>
              <span class="notification-type">${type}</span>
            </div>
            
            <div class="message">
              <h2>${title}</h2>
              <p>${message}</p>
            </div>
            
            <div class="footer">
              <p>This is an automated notification from your e-commerce dashboard.</p>
              <p>Time: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Create the email using SMTP
    const emailData = {
      from: gmailUsername,
      to: adminEmail,
      subject: `[Admin Alert] ${title}`,
      html: htmlBody,
    };

    // Use a simple logging approach for now
    try {
      console.log('Sending admin notification email:', {
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        type: type,
        title: title,
        message: message,
        timestamp: new Date().toISOString()
      });

      // Log the full email content for verification
      console.log('Email HTML content prepared:', htmlBody.substring(0, 200) + '...');

      // For debugging: Always log that we attempted to send
      console.log('📧 EMAIL NOTIFICATION TRIGGERED:', {
        adminEmail: adminEmail,
        notificationType: type,
        subject: emailData.subject
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Admin notification email logged successfully',
          details: {
            to: adminEmail,
            subject: emailData.subject,
            type: type
          }
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );

    } catch (emailError) {
      console.error('Email processing failed:', emailError);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: emailError.message,
          message: 'Email notification processing failed'
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

  } catch (error: any) {
    console.error("Error in send-admin-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);