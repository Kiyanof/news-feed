const EMAIL_CONFIG = {
    SERVICE: process.env.EMAIL_SERVICE || 'gmail',
    AUTH: {
        USERNAME: process.env.EMAIL_USERNAME || '',
        PASSWORD: process.env.EMAIL_PASSWORD || ''
    }
}

export default EMAIL_CONFIG;