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
          .filter(a => a.href && a.href.includes('/sources/dnd/phb-2024'))
          .map(a => ({ text: a.textContent.trim().replace(/\\s+/g, ' '), href: a.href }))
          .filter(a => a.text.length > 0 && a.text.length < 50);
        return Array.from(new Set(links.map(l => l.text + ' -> ' + l.href)));
      })()`,
      returnByValue: true,
    },
    session.sessionId
  );

  console.log("PHB 2024 TOC Links:\n" + evalRes?.result?.value?.join("\n"));

  await client.send("Target.closeTarget", { targetId: newTarget.targetId });
  client.close();
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
