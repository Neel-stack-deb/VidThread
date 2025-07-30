import { connectToDatabase } from "./db/index.js";

connectToDatabase()
.then((connection) => {
  console.log(`THE DATABASE ${connection.connection.name} IS CONNECTED TO :${connection.connection.host}`);
})
.catch((error) => {
  console.error("Failed to connect to the database:", error);
  process.exit(1);
});