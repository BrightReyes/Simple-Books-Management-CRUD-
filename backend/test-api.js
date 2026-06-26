const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    let teacher = await prisma.user.findFirst({ where: { role: 'TEACHER' } });
    let student = await prisma.user.findFirst({ where: { role: 'STUDENT' } });
    let book = await prisma.book.findFirst();

    await prisma.bookAssignment.upsert({
      where: { studentId_bookId: { studentId: student.id, bookId: book.id } },
      update: {},
      create: { studentId: student.id, bookId: book.id }
    });

    console.log(`Assigned book ${book.id} to student ${student.id}`);

    const loginRes = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: teacher.username, password: 'password' })
    });
    const loginData = await loginRes.json();
    const token = loginData.access_token;
    console.log("Logged in as teacher, got token");

    console.log(`Hitting DELETE http://localhost:3000/assignments/${student.id}/${book.id}`);
    const deleteRes = await fetch(`http://localhost:3000/assignments/${student.id}/${book.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Delete response:", deleteRes.status);
    if (!deleteRes.ok) {
      console.log(await deleteRes.text());
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
