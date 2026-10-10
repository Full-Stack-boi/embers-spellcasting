import { createCdpClient } from "./queryDdb.mjs";

async function main() {
  const client = await createCdpClient();
  const target = await client.send("Target.createTarget", { url: "https://www.dndbeyond.com/sources/dnd/vsspp2/valdas-spire-of-secrets-player-pack-2" });
  const session = await client.send("Target.attachToTarget", { targetId: target.targetId, flatten: true });

  await new Promise((r) => setTimeout(r, 4000));

  const evalRes = await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const headings = Array.from(document.querySelectorAll('h2, h3, h4')).map(h => ({
          tag: h.tagName,
          text: h.innerText.trim()
        }));
        return headings;
      })()
    `,
    returnByValue: true
  }, session.sessionId);

  console.log("ALL VSSPP2 Headings:");
  evalRes.result?.value.forEach(h => console.log(`${h.tag}: ${h.text}`));

  await client.send("Target.closeTarget", { targetId: target.targetId });
  client.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
