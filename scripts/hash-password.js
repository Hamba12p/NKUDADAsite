// Generates the ADMIN_PASSWORD_HASH value for your .env / Vercel settings.
//
// Usage:
//   node scripts/hash-password.js "your-chosen-password"
//
// Copy the printed hash into the ADMIN_PASSWORD_HASH environment variable.
// The plain password itself is never stored anywhere.

const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hash-password.js \"your-chosen-password\"");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log("\nADMIN_PASSWORD_HASH=" + hash + "\n");
