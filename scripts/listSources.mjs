import { createCdpClient } from "./queryDdb.mjs";

async function main() {
  const client = await createCdpClient();
  console.log("Navigating to https://www.dndbeyond.com/sources in background target...");
  const target = await client.send("Target.createTarget", { url: "https://www.dndbeyond.com/sources" });
  const session = await client.send("Target.attachToTarget", { targetId: target.targetId, flatten: true });

  await new Promise((r) => setTimeout(r, 4000));

  const evalRes = await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const links = Array.from(document.querySelectorAll('a[href^="/sources/"]'));
        const sources = links.map(a => ({
          title: a.innerText.trim() || a.getAttribute('aria-label') || a.querySelector('img')?.getAttribute('alt') || '',
          url: a.getAttribute('href')
        })).filter(s => s.title && s.url);
        // unique by url
        const map = new Map();
        for (const s of sources) {
          if (!map.has(s.url)) map.set(s.url, s.title);
        }
        return Array.from(map.entries()).map(([url, title]) => ({ url, title }));
      })()
    `,
    returnByValue: true
  }, session.sessionId);

  console.log("Sources found on D&D Beyond:");
  console.log(evalRes.result?.value);

  await client.send("Target.closeTarget", { targetId: target.targetId });
  client.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
