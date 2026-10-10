import { createCdpClient } from "./queryDdb.mjs";

async function main() {
  const client = await createCdpClient();
  const res = await client.send("Target.getTargets");
  console.log("Open Targets:");
  for (const t of res.targetInfos) {
    if (t.type === "page") {
      console.log(`- [${t.title}] (${t.url})`);
    }
  }
  client.close();
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
