import { connectToDatabase } from "./db/index.js";

const port = process.env.PORT || 3000;

connectToDatabase()
.then((connection) => {
  console.log(`THE DATABASE ${connection.connection.name} IS CONNECTED TO :${connection.connection.host}`);
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  });

  server.on('error', (error) => {
    console.error("Server error:", error);
  });

  process.on('SIGINT', ()=>shutdown('SIGINT'));
  process.on('SIGTERM', ()=>shutdown('SIGTERM'));

  
  async function shutdown(signal) {
    console.log(`Recieved ${signal}!! Shutting down server...`);
    console.log("Closing database connection...");
    await connection.connection.close();
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });

    setTimeout(() => {
      console.warn('⚠️ Cleanup taking too long. Forcing shutdown.');
      process.exit(1);
    }, 5000);
  }

})
.catch((error) => {
  console.error("Failed to connect to the database:", error);
  process.exit(1);
});