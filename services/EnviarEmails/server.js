import express, { json } from 'express';
import cors from 'cors';
import { createTransport } from 'nodemailer';

const app = express();
app.use(cors());
app.use(json());

const transporter = createTransport({
  service: 'gmail', // O usa otro proveedor
  auth: {
    user: 'omarbasal18@gmail.com',
    pass: 'wies ajqy vtia vpsj ', // Usa contraseña de aplicación si es Gmail
  },
});

app.post('/send-code', async (req, res) => {
  const { to, code } = req.body;
  try {
    await transporter.sendMail({
      from: '"Tu App" <omarbasal18@gmail.com>',
      to,
      subject: 'Código de verificación',
      text: `Tu código es: ${code}`,
      html: `<b>Tu código es: ${code}</b>`,
    });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.listen(3001, () => console.log('Servidor corriendo en puerto 3001'));