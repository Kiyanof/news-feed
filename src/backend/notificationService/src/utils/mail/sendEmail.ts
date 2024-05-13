import nodemailer from "nodemailer"
import EMAIL_CONFIG from "../../config/email.conf"
import logger from "../../config/logger"

const transporter = nodemailer.createTransport({
    service: EMAIL_CONFIG.SERVICE,
    auth: {
        user: EMAIL_CONFIG.AUTH.USERNAME,
        pass: EMAIL_CONFIG.AUTH.PASSWORD
    }
})


const sendEmail = async ({to, subject, text}:{to: string, subject: string, text: string}): Promise<boolean> => {
    logger.debug(`Sending email to ${to}`)
    const mailOptions = {
        from: EMAIL_CONFIG.AUTH.USERNAME,
        to,
        subject,
        text
    }
    logger.debug(`Mail options: ${JSON.stringify(mailOptions)}`)
    try {
        await transporter.sendMail(mailOptions)
        logger.info(`Email sent to ${to}`)
        return true
    } catch (error) {
        console.error(error)
        logger.error(`Error happened while sending email to ${to}, Error: ${error}`)
        return false
    }
}

export default sendEmail