import { createCdpClient } from "./queryDdb.mjs";

async function main() {
  const client = await createCdpClient();
  const url = "https://www.dndbeyond.com/sources/dnd/efota/the-artificer";
  console.log(`Navigating to ${url}...`);
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
        return headings;
      })()
    `,
    returnByValue: true
  }, session.sessionId);

  console.log("Artificer Features count:", evalRes.result?.value?.length);
  evalRes.result?.value?.forEach(h => console.log(`${h.tag}: ${h.text}`));

  await client.send("Target.closeTarget", { targetId: target.targetId });
  client.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
