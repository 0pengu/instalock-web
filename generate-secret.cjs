/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
require("crypto").randomBytes(48, (_, buffer) => {
  const token = buffer.toString("hex");
  console.log(token);
});
