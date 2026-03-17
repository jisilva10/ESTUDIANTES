export default async function handler(req, res) {
    // Evitar que accedan a esta URL directamente desde el navegador
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido. Solo peticiones POST.' });
    }

    // Aquí es donde Vercel inyecta tu variable de entorno de forma segura
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
        return res.status(500).json({ error: 'Falta configurar la variable de entorno en Vercel' });
    }

    try {
        // Enviar los datos desde Vercel hacia n8n
        const n8nResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        if (!n8nResponse.ok) {
            throw new Error('Error en la comunicación con n8n');
        }

        // Si todo sale bien, avisar a la página web (index.html)
        return res.status(200).json({ success: true });
        
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Fallo la conexión con el servidor interno.' });
    }
}
