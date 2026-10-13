/**
 * Resend Email Dispatch Service
 * Handles instant notification dispatch for incoming emergency callback leads.
 * Uses native fetch to the Resend API (no external dependency overhead).
 */

export interface DispatchLeadNotificationPayload {
  id: string;
  phone: string;
  service: string;
  notes?: string;
  createdAt?: string;
  source?: string;
  zipCode?: string;
}

export interface ResendNotificationResult {
  success: boolean;
  configured: boolean;
  message: string;
  emailId?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendDispatchLeadNotification(
  payload: DispatchLeadNotificationPayload
): Promise<ResendNotificationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail =
    process.env.DISPATCH_ALERT_EMAIL ||
    process.env.RESEND_TO_EMAIL ||
    process.env.ADMIN_EMAIL;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ||
    "Local Lock Dispatch <onboarding@resend.dev>";

  // If Resend API Key is not yet configured, gracefully report standby status
  if (!apiKey) {
    console.info(
      `[Resend Notice] RESEND_API_KEY is not configured yet. Callback lead #${payload.id} (${payload.phone} - ${payload.service}) saved to admin dashboard.`
    );
    return {
      success: false,
      configured: false,
      message:
        "Resend API key is not configured. Lead recorded in admin dispatch database.",
    };
  }

  if (!toEmail) {
    console.warn(
      `[Resend Warning] DISPATCH_ALERT_EMAIL is not configured. Please set the recipient email address.`
    );
    return {
      success: false,
      configured: false,
      message:
        "Target alert email (DISPATCH_ALERT_EMAIL) is not configured in environment.",
    };
  }

  const cleanPhone = payload.phone.replace(/[^\d+]/g, "");
  const safePhone = escapeHtml(payload.phone);
  const safeService = escapeHtml(payload.service);
  const safeId = escapeHtml(payload.id);
  const safeSource = escapeHtml(payload.source || "Website Callback Modal");
  const safeNotes = payload.notes ? escapeHtml(payload.notes).replace(/\n/g, "<br>") : "";

  const formattedDate = payload.createdAt
    ? new Date(payload.createdAt).toLocaleString("en-US", {
        timeZone: "America/New_York",
        dateStyle: "medium",
        timeStyle: "short",
      })
    : new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
        dateStyle: "medium",
        timeStyle: "short",
      });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Locksmith Callback Lead</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #090d16; color: #ffffff; padding: 24px; text-align: left; }
    .badge { display: inline-block; background: #059669; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 10px; rounded-radius: 999px; border-radius: 20px; }
    .title { font-size: 22px; font-weight: 900; margin: 12px 0 4px 0; color: #ffffff; }
    .subtitle { font-size: 13px; color: #94a3b8; margin: 0; }
    .body { padding: 24px; }
    .call-box { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 20px; }
    .call-label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #065f46; letter-spacing: 0.05em; margin-bottom: 6px; }
    .phone-number { font-size: 24px; font-weight: 900; color: #047857; text-decoration: none; display: inline-block; }
    .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .table td { padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .table td.label { width: 35%; color: #64748b; font-weight: 600; }
    .table td.value { color: #0f172a; font-weight: 700; }
    .notes-box { background: #f8fafc; border-left: 4px solid #10b981; padding: 12px 16px; border-radius: 0 8px 8px 0; font-size: 13px; color: #334155; margin-bottom: 24px; line-height: 1.5; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; }
    .cta-btn { display: inline-block; background: #0f172a; color: #ffffff !important; font-weight: 800; font-size: 13px; padding: 12px 24px; border-radius: 10px; text-decoration: none; margin-top: 6px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge">Live Callback Lead</div>
      <h1 class="title">New Customer Request</h1>
      <p class="subtitle">Dispatched from Local Lock &amp; Key Service Web Portal (NH)</p>
    </div>
    <div class="body">
      <div class="call-box">
        <div class="call-label">Direct Customer Phone</div>
        <a href="tel:${cleanPhone}" class="phone-number">${safePhone}</a>
        <div style="margin-top: 8px;">
          <a href="tel:${cleanPhone}" class="cta-btn">&#9742; Call Customer Now</a>
        </div>
      </div>

      <table class="table">
        <tr>
          <td class="label">Requested Service:</td>
          <td class="value">${safeService}</td>
        </tr>
        <tr>
          <td class="label">Lead ID:</td>
          <td class="value">#${safeId}</td>
        </tr>
        <tr>
          <td class="label">Source:</td>
          <td class="value">${safeSource}</td>
        </tr>
        <tr>
          <td class="label">Timestamp:</td>
          <td class="value">${formattedDate} (EST)</td>
        </tr>
      </table>

      <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">Customer Notes / Location:</div>
      <div class="notes-box">
        ${safeNotes ? safeNotes : "<em>No additional details provided.</em>"}
      </div>
    </div>
    <div class="footer">
      Local Lock &amp; Key Service &bull; Manchester &amp; New Hampshire Mobile Fleet Dispatch
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject: `🚨 New Locksmith Lead: ${payload.service} (${payload.phone})`,
        html: htmlContent,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[Resend API Error]", data);
      return {
        success: false,
        configured: true,
        message: data?.message || "Failed to send email through Resend API.",
      };
    }

    return {
      success: true,
      configured: true,
      message: "Lead notification dispatched via Resend successfully.",
      emailId: data?.id,
    };
  } catch (err: any) {
    console.error("[Resend Request Exception]", err);
    return {
      success: false,
      configured: true,
      message: err?.message || "Network exception while contacting Resend.",
    };
  }
}

export function getResendStatus(): {
  isConfigured: boolean;
  alertEmail: string | null;
  fromEmail: string;
} {
  return {
    isConfigured: Boolean(process.env.RESEND_API_KEY),
    alertEmail:
      process.env.DISPATCH_ALERT_EMAIL ||
      process.env.RESEND_TO_EMAIL ||
      process.env.ADMIN_EMAIL ||
      null,
    fromEmail:
      process.env.RESEND_FROM_EMAIL ||
      "Local Lock Dispatch <onboarding@resend.dev>",
  };
}
