import { createCdpClient } from "./queryDdb.mjs";

async function main() {
  const classSlug = process.argv[2] || "druid";
  const sectionQuery = process.argv[3]; // optional query
  const url = `https://www.dndbeyond.com/sources/dnd/phb-2024/character-classes#${classSlug.charAt(0).toUpperCase() + classSlug.slice(1)}`;

  console.log(`Navigating to: ${url}`);
  const client = await createCdpClient();
  const newTarget = await client.send("Target.createTarget", { url });
  const session = await client.send("Target.attachToTarget", {
    targetId: newTarget.targetId,
    flatten: true,
  });

  // Wait for page load
  await new Promise((r) => setTimeout(r, 6000));

  const evalRes = await client.send(
    "Runtime.evaluate",
    {
      expression: `(() => {
        const query = ${JSON.stringify(sectionQuery || "")};
        if (!query) {
          const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5'))
            .map(h => ({ tag: h.tagName, text: h.textContent.trim().replace(/\\s+/g, ' ') }))
            .filter(h => h.text.length > 0 && h.text.length < 100);
          return { title: document.title, headings };
        }

        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5'));
        const found = headings.filter(h => h.textContent.toLowerCase().includes(query.toLowerCase()));
        return found.map(h => {
          let text = h.textContent.trim() + '\\n';
          let curr = h.nextElementSibling;
          let count = 0;
          while (curr && count < 15 && !['H1', 'H2', 'H3'].includes(curr.tagName)) {
            text += (curr.innerText || curr.textContent).trim() + '\\n\\n';
            curr = curr.nextElementSibling;
            count++;
          }
          return text;
        });
      })()`,
      returnByValue: true,
    },
    session.sessionId
  );

  console.log("Result:", JSON.stringify(evalRes?.result?.value, null, 2));

  await client.send("Target.closeTarget", { targetId: newTarget.targetId });
  client.close();
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
