export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { type, name, email, phone, company, solution, area, message } = body;

    // Configuración de EmailJS proporcionada por el usuario
    const serviceId = import.meta.env.EMAILJS_SERVICE_ID || process.env.EMAILJS_SERVICE_ID || "service_d9s932s";
    const templateId = import.meta.env.EMAILJS_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID || "template_tv1wxvr";
    const publicKey = import.meta.env.EMAILJS_PUBLIC_KEY || process.env.EMAILJS_PUBLIC_KEY || "NDw-sqnPn4gFu4c53";

    let formTypeLabel = "Nuevo Prospecto";
    if (type === "contact") {
      formTypeLabel = "Contacto";
    } else if (type === "hero") {
      formTypeLabel = "Propuesta Inicio";
    } else if (type === "proposal") {
      formTypeLabel = "Solicitud de Soluciones";
    } else if (type === "talent") {
      formTypeLabel = "Talento Humano";
    }

    const templateParams = {
      form_type: formTypeLabel,
      name: name || "No especificado",
      company: company || "No especificada",
      email: email || "No especificado",
      phone: phone || "No especificado",
      solution: solution || "No especificada",
      area: area || "No especificado",
      message: message || "Sin comentarios adicionales"
    };

    // Llamada directa y súper veloz a la API REST oficial de EmailJS
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: templateParams
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ success: false, error: errorText }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ success: true }), { 
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
