import { createCdpClient } from "./queryDdb.mjs";

async function main() {
  const className = process.argv[2] || "Druid";
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
        const clsName = ${JSON.stringify(className.toLowerCase())};
        const allHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5'));
        
        // Find index of H2 that matches clsName
        const startIndex = allHeadings.findIndex(h => h.tagName === 'H2' && h.textContent.trim().toLowerCase() === clsName);
        if (startIndex === -1) {
          return { error: 'Class H2 not found: ' + clsName, h2s: allHeadings.filter(h => h.tagName === 'H2').map(h => h.textContent.trim()) };
        }

        // Find next H2
        let endIndex = allHeadings.findIndex((h, idx) => idx > startIndex && h.tagName === 'H2');
        if (endIndex === -1) endIndex = allHeadings.length;

        const classHeadings = allHeadings.slice(startIndex, endIndex).map(h => ({
          tag: h.tagName,
          text: h.textContent.trim().replace(/\\s+/g, ' ')
        }));

        return { className: clsName, headings: classHeadings };
      })()`,
      returnByValue: true,
    },
    session.sessionId
  );

  console.log("EvalRes:", JSON.stringify(evalRes, null, 2));

  await client.send("Target.closeTarget", { targetId: newTarget.targetId });
  client.close();
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
