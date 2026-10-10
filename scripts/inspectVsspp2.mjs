import { createCdpClient } from "./queryDdb.mjs";

async function main() {
  const client = await createCdpClient();
  console.log("Navigating to https://www.dndbeyond.com/sources/dnd/vsspp2...");
  const target = await client.send("Target.createTarget", { url: "https://www.dndbeyond.com/sources/dnd/vsspp2" });
  const session = await client.send("Target.attachToTarget", { targetId: target.targetId, flatten: true });

  await new Promise((r) => setTimeout(r, 4000));

  const evalRes = await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const title = document.title;
        const url = window.location.href;
        const allLinks = Array.from(document.querySelectorAll('a')).map(a => ({
          text: a.innerText.trim(),
          href: a.getAttribute('href')
        })).filter(l => l.text && l.href && (l.href.includes('vss') || l.href.includes('valda') || l.href.includes('sources')));
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => ({
          tag: h.tagName,
          text: h.innerText.trim()
        }));
        return { title, url, linksCount: document.querySelectorAll('a').length, allLinks: allLinks.slice(0, 30), headings: headings.slice(0, 30) };
      })()
    `,
    returnByValue: true
  }, session.sessionId);

  console.log("VSSPP2 Table of Contents / Links:");
  console.log(evalRes.result?.value);

  await client.send("Target.closeTarget", { targetId: target.targetId });
  client.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
