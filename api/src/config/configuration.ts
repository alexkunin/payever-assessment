export default () => ({
  reqres: {
    url: process.env.REQRES_API_URL,
    timeout: parseInt(process.env.REQRES_API_TIMEOUT ?? '', 10) || 5000,
  },
  rabbitmq: {
    host: process.env.RABBITMQ_HOST,
    user: process.env.RABBITMQ_USER,
    password: process.env.RABBITMQ_PASS,
  },
  smtp: {
    uri: process.env.SMTP_URI,
  },
  avatar: {
    timeout: parseInt(process.env.AVATAR_TIMEOUT ?? '', 10) || 5000,
    path: process.env.AVATAR_PATH,
  },
  mongo: {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    host: process.env.MONGO_HOST,
  },
});
