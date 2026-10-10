import { createCdpClient } from "./queryDdb.mjs";

async function main() {
  const classes = ["Bard", "Sorcerer", "Warlock", "Wizard"];
  const url = "https://www.dndbeyond.com/sources/dnd/phb-2024/character-classes";

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
        const clsList = ${JSON.stringify(classes.map(c => c.toLowerCase()))};
        const allHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5'));
        
        const results = {};
        for (const cls of clsList) {
          const startIndex = allHeadings.findIndex(h => h.tagName === 'H2' && h.textContent.trim().toLowerCase() === cls);
          if (startIndex === -1) {
            results[cls] = null;
            continue;
          }
          let endIndex = allHeadings.findIndex((h, idx) => idx > startIndex && h.tagName === 'H2');
          if (endIndex === -1) endIndex = allHeadings.length;

          results[cls] = allHeadings.slice(startIndex, endIndex).map(h => ({
            tag: h.tagName,
            text: h.textContent.trim().replace(/\\s+/g, ' ')
          }));
        }

        return results;
      })()`,
      returnByValue: true,
    },
    session.sessionId
  );

  console.log("All Casters Headings:\n", JSON.stringify(evalRes?.result?.value, null, 2));

  await client.send("Target.closeTarget", { targetId: newTarget.targetId });
  client.close();
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
