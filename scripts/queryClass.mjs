import { createCdpClient } from "./queryDdb.mjs";

async function main() {
  const url = process.argv[2] || "https://www.dndbeyond.com/sources/dnd/phb-2024/character-classes";
  const client = await createCdpClient();
  const newTarget = await client.send("Target.createTarget", { url });
  const session = await client.send("Target.attachToTarget", {
    targetId: newTarget.targetId,
    flatten: true,
  });

  await new Promise((r) => setTimeout(r, 4500));

  const evalRes = await client.send(
    "Runtime.evaluate",
    {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('a'))
          .filter(a => a.href && (a.href.includes('/classes/') || a.href.includes('/sources/dnd/phb-2024')))
          .map(a => ({ text: a.textContent.trim(), href: a.href }));
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4'))
          .map(h => h.textContent.trim())
          .filter(t => t.length > 0 && t.length < 80);
        return {
          title: document.title,
          links: Array.from(new Set(links.map(l => l.text + ' -> ' + l.href))),
          headings: headings.slice(0, 30)
        };
      })()`,
      returnByValue: true,
    },
    session.sessionId
  );

  console.log("Title:", evalRes?.result?.value?.title);
  console.log("Links:", evalRes?.result?.value?.links);
  console.log("Headings:", evalRes?.result?.value?.headings);

  await client.send("Target.closeTarget", { targetId: newTarget.targetId });
  client.close();
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
