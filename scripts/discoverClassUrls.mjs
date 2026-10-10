import { createCdpClient } from "./queryDdb.mjs";

async function main() {
  const client = await createCdpClient();
  const res = await client.send("Target.getTargets");
  const target = res.targetInfos.find(t => t.url.includes("2190875-barbarian"));
  if (!target) {
    console.log("Barbarian tab not found");
    client.close();
    process.exit(1);
  }
  const session = await client.send("Target.attachToTarget", {
    targetId: target.targetId,
    flatten: true,
  });

  const evalRes = await client.send(
    "Runtime.evaluate",
    {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('a'))
          .filter(a => a.href && a.href.includes('/classes/'))
          .map(a => ({ text: a.textContent.trim(), href: a.href }));
        return Array.from(new Set(links.map(l => l.text + ' -> ' + l.href)));
      })()`,
      returnByValue: true,
    },
    session.sessionId
  );

  console.log("Found class links:", evalRes?.result?.value);
  await client.send("Target.closeTarget", { targetId: newTarget.targetId });
  client.close();
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
