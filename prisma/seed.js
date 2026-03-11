const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "test@staff.babcock.edu.ng";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      fullName: "System Admin",
      role: "admin",
      password: hashedPassword,
      department: "Administration",
      level: null,
      matricNo: null,
    },
    create: {
      fullName: "System Admin",
      email: adminEmail,
      role: "admin",
      password: hashedPassword,
      department: "Administration",
      level: null,
      matricNo: null,
    },
  });

  const courses = [
    { code: "CSC101", title: "Introduction to Computing", level: 100 },
    { code: "MTH101", title: "Elementary Mathematics", level: 100 },
    { code: "GST111", title: "Communication in English", level: 100 },
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { code: course.code },
      update: {
        title: course.title,
        level: course.level,
      },
      create: course,
    });
  }

  console.log("Seed completed: admin and default courses upserted.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
