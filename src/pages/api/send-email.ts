export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { type, name, email, phone, company, solution, area, message, file } = body;

    const resendApiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY || "re_LR2zfhr5_8uwEn8zLSp3spo2ieXfqULE2";
    
    // NOTA DE PRUEBAS: Resend en su plan gratuito (sin dominio propio verificado) exige que el 
    // destinatario sea el correo de la cuenta registrada ("edwi.castruita117@gmail.com"). 
    // Una vez que verifiques tu dominio en resend.com/domains, cambia el remitente "from" de 
    // "onboarding@resend.dev" a "tu-correo@tu-dominio.com" y podrás enviar correos a cualquier 
    // dirección (como "edwin.castruita@wispi.mx").
    const toEmail = import.meta.env.RESEND_TO_EMAIL || process.env.RESEND_TO_EMAIL || "edwi.castruita117@gmail.com";

    let subject = "Nuevo Prospecto - XCIEN";
    let htmlContent = "";

    if (type === "contact") {
      subject = `[Contacto] Nuevo mensaje de ${name} - XCIEN`;
      htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #fcfcfc;">
          <div style="background-color: #1a1c22; padding: 25px; border-bottom: 4px solid #65d46e; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">XCIEN - Nuevo Contacto</h2>
          </div>
          <div style="padding: 30px; color: #333333; line-height: 1.6;">
            <p style="font-size: 16px; margin-top: 0;">Se ha recibido un nuevo mensaje a través del formulario de <strong>Contacto</strong>:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; width: 35%; color: #666666;">Nombre:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #111111; font-weight: 500;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #666666;">Empresa:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #111111;">${company || 'No especificada'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #666666;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;"><a href="mailto:${email}" style="color: #65d46e; text-decoration: none; font-weight: 600;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #666666;">Teléfono:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;"><a href="tel:${phone}" style="color: #333333; text-decoration: none; font-weight: 600;">${phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #666666;">Solución de Interés:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;"><span style="background-color: #eafbf0; color: #22c55e; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: bold;">${solution || 'No especificada'}</span></td>
              </tr>
            </table>
            <div style="margin-top: 25px; padding: 20px; background-color: #f5f5f5; border-radius: 8px; border-left: 4px solid #65d46e;">
              <p style="margin: 0; font-weight: bold; font-size: 14px; color: #555555; margin-bottom: 8px;">Mensaje:</p>
              <p style="margin: 0; font-style: italic; font-size: 14px; color: #222222;">"${message || 'Sin mensaje adicional'}"</p>
            </div>
          </div>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-top: 1px solid #e5e5e5; font-size: 11px; color: #888888;">
            Este correo fue enviado de forma automática desde xcien.com
          </div>
        </div>
      `;
    } else if (type === "hero" || type === "proposal") {
      const typeLabel = type === "hero" ? "Hero Inicio" : "Soluciones";
      subject = `[Cotización] Nueva solicitud desde ${typeLabel} de ${name} - XCIEN`;
      htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #fcfcfc;">
          <div style="background-color: #1a1c22; padding: 25px; border-bottom: 4px solid #65d46e; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">XCIEN - Solicitud de Propuesta</h2>
          </div>
          <div style="padding: 30px; color: #333333; line-height: 1.6;">
            <p style="font-size: 16px; margin-top: 0;">Un nuevo prospecto ha solicitado una cotización personalizada a través del formulario de <strong>${typeLabel}</strong>:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; width: 35%; color: #666666;">Nombre:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #111111; font-weight: 500;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #666666;">Compañía / Giro:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #111111;">${company}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #666666;">Teléfono:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;"><a href="tel:${phone}" style="color: #333333; text-decoration: none; font-weight: 600;">${phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #666666;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;"><a href="mailto:${email}" style="color: #65d46e; text-decoration: none; font-weight: 600;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #666666;">Solución Requerida:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;"><span style="background-color: #eafbf0; color: #22c55e; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: bold;">${solution || 'No especificada'}</span></td>
              </tr>
            </table>
            <div style="margin-top: 25px; padding: 20px; background-color: #f5f5f5; border-radius: 8px; border-left: 4px solid #65d46e;">
              <p style="margin: 0; font-weight: bold; font-size: 14px; color: #555555; margin-bottom: 8px;">Mensaje / Reto o Ubicación:</p>
              <p style="margin: 0; font-style: italic; font-size: 14px; color: #222222;">"${message || 'Sin mensaje adicional'}"</p>
            </div>
          </div>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-top: 1px solid #e5e5e5; font-size: 11px; color: #888888;">
            Este correo fue enviado de forma automática desde xcien.com
          </div>
        </div>
      `;
    } else if (type === "talent") {
      subject = `[Talento] Candidatura recibida de ${name} - XCIEN`;
      htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #fcfcfc;">
          <div style="background-color: #1a1c22; padding: 25px; border-bottom: 4px solid #65d46e; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">XCIEN - Nueva Candidatura</h2>
          </div>
          <div style="padding: 30px; color: #333333; line-height: 1.6;">
            <p style="font-size: 16px; margin-top: 0;">Un candidato se ha postulado para unirse al equipo de XCIEN:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; width: 35%; color: #666666;">Candidato:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #111111; font-weight: 500;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #666666;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;"><a href="mailto:${email}" style="color: #65d46e; text-decoration: none; font-weight: 600;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #666666;">Teléfono:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;"><a href="tel:${phone}" style="color: #333333; text-decoration: none; font-weight: 600;">${phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #666666;">Área de interés:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;"><span style="background-color: #eafbf0; color: #22c55e; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: bold;">${area}</span></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #666666;">CV Adjunto:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #111111;">${file ? `<strong>${file.filename}</strong> (Adjunto en este correo)` : '<span style="color: #999999; font-style: italic;">No se adjuntó archivo</span>'}</td>
              </tr>
            </table>
            <div style="margin-top: 25px; padding: 20px; background-color: #f5f5f5; border-radius: 8px; border-left: 4px solid #65d46e;">
              <p style="margin: 0; font-weight: bold; font-size: 14px; color: #555555; margin-bottom: 8px;">Presentación del candidato:</p>
              <p style="margin: 0; font-style: italic; font-size: 14px; color: #222222;">"${message || 'Sin mensaje de presentación'}"</p>
            </div>
          </div>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-top: 1px solid #e5e5e5; font-size: 11px; color: #888888;">
            Este correo fue enviado de forma automática desde xcien.com
          </div>
        </div>
      `;
    }

    const resendBody: any = {
      from: "XCIEN Lead <onboarding@resend.dev>",
      to: toEmail,
      subject: subject,
      html: htmlContent
    };

    // Si hay un archivo adjunto, extraer base64 puro y agregarlo al array de attachments
    if (file && file.content && file.filename) {
      // Remover cabecera data:application/pdf;base64, si estuviera presente
      let base64Data = file.content;
      if (base64Data.includes(";base64,")) {
        base64Data = base64Data.split(";base64,").pop();
      }

      resendBody.attachments = [
        {
          filename: file.filename,
          content: base64Data
        }
      ];
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(resendBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ success: false, error: errorText }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
