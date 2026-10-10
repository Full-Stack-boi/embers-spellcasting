import { createCdpClient } from "./queryDdb.mjs";

async function main() {
  const url = "https://www.dndbeyond.com/sources/dnd/phb-2024/character-classes";
  const client = await createCdpClient();
  const newTarget = await client.send("Target.createTarget", { url });
  const session = await client.send("Target.attachToTarget", {
    targetId: newTarget.targetId,
    flatten: true,
  });

  await new Promise((r) => setTimeout(r, 6000));

  const evalRes = await client.send(
    "Runtime.evaluate",
    {
      expression: `Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim())`,
      returnByValue: true,
    },
    session.sessionId
  );

  console.log("All H2s on character-classes page:", evalRes?.result?.value);

  await client.send("Target.closeTarget", { targetId: newTarget.targetId });
  client.close();
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
