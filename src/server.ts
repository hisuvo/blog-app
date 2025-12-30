import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to database successfuly");

    // add here application
    app.listen(PORT, () => {
      console.log(`Server is runing on http://localhost:${PORT}`);
    });
  } catch (error: any) {
    console.log("Catch an error", error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
