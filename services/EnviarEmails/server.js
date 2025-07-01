import express, { json } from "express";
import cors from "cors";
import { createTransport } from "nodemailer";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import bcrypt from "bcryptjs";
import { createRequire } from "module"; // <--- AGREGA ESTA LÍNEA
const require = createRequire(import.meta.url);
const serviceAccount = require("./inundaqro-f2dfa-firebase-adminsdk-fbsvc-592ba6116f.json")

const app = express();
app.use(cors());
app.use(json());

initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

const transporter = createTransport({
  service: "gmail", // O usa otro proveedor
  auth: {
    user: "omarbasal18@gmail.com",
    pass: "wies ajqy vtia vpsj ", // Usa contraseña de aplicación si es Gmail
  },
});

app.post("/send-code", async (req, res) => {
  const { to, code } = req.body;
  try {
    await transporter.sendMail({
      from: '"Tu App" <omarbasal18@gmail.com>',
      to,
      subject: "Código de verificación",
      text: `Tu código es: ${code}`,
      html: `<b>Tu código es: ${code}</b>`,
    });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    console.log("Recibido reset-password para:", email);
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();
    if (snapshot.empty) {
      console.log("Usuario no encontrado:", email);
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });
    }
    const userDoc = snapshot.docs[0];
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);
    await userDoc.ref.update({ password: hashedPassword });
    console.log("Contraseña actualizada para:", email);
    res.json({ success: true });
  } catch (e) {
    console.error("Error en reset-password:", e);
    res.status(500).json({ success: false, error: e.message });
  }
});



app.listen(3001, () => console.log("Servidor corriendo en puerto 3001"));
