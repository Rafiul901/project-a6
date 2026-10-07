
import app from "./app/app.js";
import config from "./config/index.js";

const PORT = process.env.PORT || config.port || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;