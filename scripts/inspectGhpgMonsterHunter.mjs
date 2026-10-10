import { createCdpClient } from "./queryDdb.mjs";

async function main() {
  const client = await createCdpClient();
  const url = "https://www.dndbeyond.com/sources/dnd/ghpg/chapter-2-classes-subclasses";
  const target = await client.send("Target.createTarget", { url });
  const session = await client.send("Target.attachToTarget", { targetId: target.targetId, flatten: true });

  await new Promise((r) => setTimeout(r, 4500));

  const evalRes = await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const headings = Array.from(document.querySelectorAll('h2, h3, h4, h5')).map(h => ({
          tag: h.tagName,
          text: h.innerText.trim()
        }));
        const mhHeadings = headings.filter(h => 
          h.text.toLowerCase().includes('monster hunter') || 
          h.text.toLowerCase().includes('guild') ||
          h.text.toLowerCase().includes('grimoire') ||
          h.text.toLowerCase().includes('strike')
        );
        return { total: headings.length, first50: headings.slice(0, 50), mhHeadings };
      })()
    `,
    returnByValue: true
  }, session.sessionId);

  console.log("Monster Hunter headings & First 50 headings:");
  console.log(evalRes.result?.value);

  await client.send("Target.closeTarget", { targetId: target.targetId });
  client.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
