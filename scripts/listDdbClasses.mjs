import { createCdpClient } from "./queryDdb.mjs";

async function main() {
  const client = await createCdpClient();
  const targetUrl = process.argv[2] || "https://www.dndbeyond.com/classes";
  const newTarget = await client.send("Target.createTarget", { url: targetUrl });
  const session = await client.send("Target.attachToTarget", {
    targetId: newTarget.targetId,
    flatten: true,
  });

  await new Promise((r) => setTimeout(r, 4000));

  const evalRes = await client.send(
    "Runtime.evaluate",
    {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('a'))
          .filter(a => a.href && (a.href.includes('/classes/') || a.href.includes('/sources/dnd/phb-2024') || a.href.includes('/sources/dnd/free-rules')))
          .map(a => ({ text: a.textContent.trim().replace(/\\s+/g, ' '), href: a.href }))
          .filter(item => item.text.length > 0 && item.text.length < 60);
        return {
          title: document.title,
          links: Array.from(new Set(links.map(l => l.text + ' -> ' + l.href)))
        };
      })()`,
      returnByValue: true,
    },
    session.sessionId
  );

  console.log("Title:", evalRes?.result?.value?.title);
  console.log("Links count:", evalRes?.result?.value?.links?.length);
  evalRes?.result?.value?.links?.forEach((l) => console.log(l));

  await client.send("Target.closeTarget", { targetId: newTarget.targetId });
  client.close();
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
