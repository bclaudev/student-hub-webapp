import { faker } from "@faker-js/faker";
import { posthog } from "./lib/posthog.js";
import { db } from "./db.js";
import { usersTable } from "./drizzle/schema.js";

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const FILE_TYPES = [
  { type: "application/pdf", ext: ".pdf" },
  { type: "image/png", ext: ".png" },
  {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ext: ".docx",
  },
  { type: "application/zip", ext: ".zip" },
];

async function seedResourceUploads(users, maxFilesPerUser = 5) {
  for (const user of users) {
    const fileCount = faker.number.int({ min: 1, max: maxFilesPerUser });
    const files = Array.from({ length: fileCount }, () => {
      const type = getRandom(FILE_TYPES);
      const sizeBytes = faker.number.int({ min: 100000, max: 10_000_000 });
      return {
        fileName: faker.system.fileName({ extension: type.ext.slice(1) }),
        fileSize: sizeBytes,
        fileType: type.type,
        sizeMB: parseFloat((sizeBytes / 1024 / 1024).toFixed(2)),
      };
    });

    const totalSizeBytes = files.reduce((acc, f) => acc + f.fileSize, 0);
    const totalSizeMB = parseFloat((totalSizeBytes / 1024 / 1024).toFixed(2));

    posthog.capture({
      distinctId: user.id.toString(),
      event: "resource_uploaded",
      properties: {
        fileName: files[0].fileName, // for first file only
        fileSize: files[0].fileSize,
        fileType: files[0].fileType,
        fileTypes: files.map((f) => f.fileType),
        totalFiles: files.length,
        totalSizeBytes: totalSizeBytes,
        totalSizeMB: totalSizeMB,
      },
    });
  }
}

(async () => {
  const users = await db.select().from(usersTable);
  await seedResourceUploads(users);
  console.log("Resource upload PostHog events seeded.");
})();
