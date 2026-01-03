import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth";

const seedAdmin = async () => {
  try {
    const adminData = {
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASS,
      role: UserRole.ADMIN,
    };

    const existsAdmin = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existsAdmin) {
      throw new Error("your account is already exists");
    }

    const singUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );

    if (singUpAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};

seedAdmin();
