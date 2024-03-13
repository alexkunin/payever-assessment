export default () => ({
  reqres: {
    url: process.env.REQRES_API_URL,
    timeout: parseInt(process.env.REQRES_API_TIMEOUT ?? '', 10) || 5000,
  },
});
