const app  = require('./app')
const config  = require('./config/config');

const port = config.SERVER_PORT || 5002;
app.listen(port, () => {
  console.log(`[server]: Local server running at https://localhost:${port}`);
});

module.exports = app