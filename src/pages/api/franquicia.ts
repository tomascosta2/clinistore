export const prerender = false;

import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  const nombre = (data.nombre ?? '').trim();
  const email = (data.email ?? '').trim();
  const telefono = (data.telefono ?? '').trim();
  const ciudad = (data.ciudad ?? '').trim();
  const mensaje = (data.mensaje ?? '').trim();

  if (!nombre || !email || !telefono || !ciudad) {
    return new Response(JSON.stringify({ ok: false, error: 'Completá todos los campos obligatorios.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const transporter = nodemailer.createTransport({
    host: 'c2731379.ferozo.com',
    port: 465,
    secure: true,
    auth: {
      user: import.meta.env.SMTP_USER,
      pass: import.meta.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Clinistore Franquicias" <${import.meta.env.SMTP_USER}>`,
      to: import.meta.env.SMTP_TO,
      subject: `Nueva solicitud de franquicia - ${nombre}`,
      html: `
        <h2>Nueva solicitud de franquicia</h2>
        <table cellpadding="8" style="border-collapse:collapse;font-family:sans-serif;">
          <tr><td><strong>Nombre:</strong></td><td>${nombre}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
          <tr><td><strong>Teléfono:</strong></td><td>${telefono}</td></tr>
          <tr><td><strong>Ciudad/Provincia:</strong></td><td>${ciudad}</td></tr>
          ${mensaje ? `<tr><td><strong>Mensaje:</strong></td><td>${mensaje}</td></tr>` : ''}
        </table>
      `,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error enviando email:', err);
    return new Response(JSON.stringify({ ok: false, error: 'No se pudo enviar el correo. Intentá de nuevo más tarde.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
