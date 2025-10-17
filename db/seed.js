import db from "#db/client";

import { createTask } from "#db/queries/tasks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user1 = await createUser("alphonse25", "userpassword");
  for (let i = 1; i <= 5; i++) {
    await createTask(`To do: ${i}`, false, user.id);
  }
}
