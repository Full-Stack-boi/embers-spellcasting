import { createCdpClient } from "./queryDdb.mjs";

async function main() {
  const url = "https://www.dndbeyond.com/sources/dnd/phb-2024";
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
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('a'))
          .filter(a => a.href && a.href.includes('/sources/dnd/phb-2024/'))
          .map(a => ({ text: a.textContent.trim().replace(/\\s+/g, ' '), href: a.href }));
        const unique = [];
        const seen = new Set();
        for (const l of links) {
          const page = l.href.split('#')[0];
          if (!seen.has(page)) {
            seen.add(page);
            unique.push(l.text + ' -> ' + page);
          }
        }
        return unique;
      })()`,
      returnByValue: true,
    },
    session.sessionId
  );

  console.log("PHB 2024 Pages:\n" + evalRes?.result?.value?.join("\n"));

  await client.send("Target.closeTarget", { targetId: newTarget.targetId });
  client.close();
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
