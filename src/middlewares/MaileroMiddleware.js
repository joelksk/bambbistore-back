import { MailerooClient } from 'maileroo'

const apiKey = process.env.MaILEROO_API_KEY;
const mailerooClient = MailerooClient.getClient(apiKey);

export const sendEmail = async (user, ordenId) => {
    try {
        await mailerooClient
            .setFrom('BBambbistore', 'no-reply@bambbistore.com.ar')
            .setTo(`${user.name}`, `${user.email}`)
            .setSubject('Gracias por tu compra!')
            .setHtml(`  <h1>Welcome</h1>
                        <p>Hemos recibido tu pago correctamente.</p>
                        <p>Tu número de pedido es: <strong>${ordenId}</strong></p>
                        <p>Guarda este código para cualquier consulta o seguimiento de tu compra.</p>`)
            .setPlain('Welcome')
            .sendBasicEmail();
    } catch (error) {
        console.log(error)
    }
}
