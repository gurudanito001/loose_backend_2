import app from './app'
import config from './config/config'

const port = config.SERVER_PORT || 5000;
app.listen(port, () => {
  console.log(`[server]: Local server running at https://localhost:${port}`);
});

export default app;