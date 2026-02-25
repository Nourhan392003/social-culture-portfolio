import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Save to Supabase
    const { error } = await supabase
      .from("contact_messages")
      .insert([{ name, email, message }]);

    if (error) {
      console.log("Supabase error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Send Email
   // Send email to YOU
   const ticketId = "SC-" + Date.now();
await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: "رسالة جديدة من الموقع",
  html: `
    <h3>رسالة جديدة</h3>
    <p><strong>الاسم:</strong> ${name}</p>
    <p><strong>الإيميل:</strong> ${email}</p>
    <p><strong>الرسالة:</strong> ${message}</p>
  `,
});

// Auto reply to client
await transporter.sendMail({
  from: `"Social Culture" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: `تم استلام رسالتك ✔ | Ticket ${ticketId}`,
  html: `
  <div style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 10px;">
      <tr>
        <td align="center">
          <table width="100%" max-width="600" cellpadding="0" cellspacing="0" 
                 style="background:#111;border-radius:16px;padding:30px;color:#fff;">
            
            <!-- Logo -->
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <img src="https://i.ibb.co/your-logo.png" 
                     width="80" 
                     style="margin-bottom:10px;" />
                <h2 style="color:#22c55e;margin:0;">Social Culture</h2>
                <p style="color:#888;margin:5px 0 0;">Digital Growth Partner</p>
              </td>
            </tr>

            <!-- Ticket -->
            <tr>
              <td align="center" style="padding:10px 0;">
                <span style="background:#1f2937;
                             padding:6px 12px;
                             border-radius:6px;
                             font-size:12px;
                             color:#22c55e;">
                  Ticket ID: ${ticketId}
                </span>
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td style="padding:20px 0;">
                <h3 style="color:#22c55e;margin:0;">
                  شكرًا لتواصلك معنا 💚
                </h3>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="color:#ddd;line-height:1.7;font-size:14px;">
                <p>أستاذ/ة <strong>${name}</strong>،</p>
                <p>
                  تم استلام رسالتك بنجاح.
                  فريقنا سيراجع طلبك ويتواصل معك خلال 24 ساعة.
                </p>
              </td>
            </tr>

            <!-- Button -->
            <tr>
              <td align="center" style="padding:25px 0;">
                <a href="https://wa.me/201011405879"
                   style="background:#22c55e;
                          color:#000;
                          padding:14px 28px;
                          text-decoration:none;
                          border-radius:10px;
                          font-weight:bold;
                          display:inline-block;">
                   تواصل مباشر عبر واتساب
                </a>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="border-top:1px solid #222;
                         padding-top:20px;
                         color:#777;
                         font-size:12px;
                         text-align:center;">
                © 2026 Social Culture. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `,
});
   return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}