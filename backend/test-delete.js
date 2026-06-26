const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const assignments = await prisma.bookAssignment.findMany();
    console.log("Existing assignments:", assignments);
    if (assignments.length > 0) {
      const a = assignments[0];
      console.log(`Deleting assignment studentId=${a.studentId}, bookId=${a.bookId}`);
      await prisma.bookAssignment.delete({
        where: {
          studentId_bookId: {
            studentId: a.studentId,
            bookId: a.bookId
          }
        }
      });
      console.log("Deleted successfully.");
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
