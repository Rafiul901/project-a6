import app from "./app/app.js";
import config from "./config/index.js";

if (process.env.NODE_ENV !== "production") {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

export default app;