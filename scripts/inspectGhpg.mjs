import { createCdpClient } from "./queryDdb.mjs";

async function main() {
  const client = await createCdpClient();
  console.log("Navigating to https://www.dndbeyond.com/sources/dnd/ghpg...");
  const target = await client.send("Target.createTarget", { url: "https://www.dndbeyond.com/sources/dnd/ghpg" });
  const session = await client.send("Target.attachToTarget", { targetId: target.targetId, flatten: true });

  await new Promise((r) => setTimeout(r, 4000));

  const evalRes = await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const title = document.title;
        const url = window.location.href;
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => ({
          tag: h.tagName,
          text: h.innerText.trim()
        }));
        const links = Array.from(document.querySelectorAll('a[href*="/sources/dnd/ghpg"]')).map(a => ({
          text: a.innerText.trim(),
          href: a.getAttribute('href')
        }));
        return { title, url, headings: headings.slice(0, 40), links: links.slice(0, 40) };
      })()
    `,
    returnByValue: true
  }, session.sessionId);

  console.log("GHPG Info:");
  console.log(evalRes.result?.value);

  await client.send("Target.closeTarget", { targetId: target.targetId });
  client.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
