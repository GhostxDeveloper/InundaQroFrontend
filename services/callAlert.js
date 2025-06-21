// callAlert.js (Node.js backend)
const express = require('express');
const twilio = require('twilio');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// Configura tus credenciales de Twilio
const accountSid = 'ACa36f474cf7486d6b78a6d72788e5575f';
const authToken = '049bb06e82cb665c18cc17170a467dd4';
const twilioNumber = '+524427167903'; // Ej: +5215555555555

const client = twilio(accountSid, authToken);

// Endpoint para recibir alerta y hacer llamada
app.post('/api/alerta-inundacion', async (req, res) => {
    const { phoneNumber, message } = req.body;

    try {
        await client.calls.create({
            to: phoneNumber,
            from: twilioNumber,
            twiml: `<Response><Say language="es-MX" voice="woman">${message}</Say></Response>`
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error al llamar:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Inicia el servidor
app.listen(3001, () => {
    console.log('Servidor de alertas corriendo en puerto 3001');
});