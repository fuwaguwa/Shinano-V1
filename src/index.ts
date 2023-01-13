import { config } from "dotenv";
import { Shinano } from "./structures/Client";
config();

const client = new Shinano();
client.start();

export { client };
