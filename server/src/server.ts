import app from './app/index'
import { SERVER_PORT } from "./config/config";

app.listen(SERVER_PORT, () => console.log(`Successfully started server on port ${SERVER_PORT}`));
