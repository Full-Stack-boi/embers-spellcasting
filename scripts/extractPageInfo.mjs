import { createCdpClient } from "./queryDdb.mjs";

async function main() {
  const filter = process.argv[2] || "2190875-barbarian";
  const client = await createCdpClient();
  const res = await client.send("Target.getTargets");
  const target = res.targetInfos.find(
    (t) => t.url.includes(filter) || t.title.toLowerCase().includes(filter.toLowerCase())
  );

  if (!target) {
    console.log(`No open page found matching "${filter}". Available pages:`);
    res.targetInfos
      .filter((t) => t.type === "page")
      .forEach((t) => console.log(`- ${t.title} (${t.url})`));
    client.close();
    process.exit(1);
  }

  console.log(`Attaching to: [${target.title}] (${target.url})`);
  const session = await client.send("Target.attachToTarget", {
    targetId: target.targetId,
    flatten: true,
  });

  const evalRes = await client.send(
    "Runtime.evaluate",
    {
      expression: `(() => {
        const headings = Array.from(document.querySelectorAll('h2, h3, h4, h5'))
          .map(h => ({ tag: h.tagName, text: h.textContent.trim().replace(/\\s+/g, ' ') }))
          .filter(h => h.text.length > 0 && h.text.length < 100);
        return {
          title: document.title,
          headings
        };
      })()`,
      returnByValue: true,
    },
    session.sessionId
  );

  const sectionArgIndex = process.argv.indexOf("--section");
  const targetSection = sectionArgIndex !== -1 ? process.argv[sectionArgIndex + 1] : null;

  if (targetSection) {
    const evalSection = await client.send(
      "Runtime.evaluate",
      {
        expression: `(() => {
          const needle = "${targetSection.toLowerCase()}";
          const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5'));
          const found = headings.find(h => h.textContent.trim().toLowerCase().includes(needle));
          if (!found) return 'Section not found: ' + needle;

          let el = found;
          // Walk up to find a container with decent content, or traverse siblings
          let container = el.parentElement;
          while (container && container.innerText.length < 300 && container.tagName !== 'BODY') {
            container = container.parentElement;
          }
          if (container && container.tagName !== 'BODY' && container.innerText.length < 15000) {
            return container.innerText;
          }
          // Fallback: take next 20 siblings of el
          let text = el.textContent.trim() + '\\n\\n';
          let curr = el.nextElementSibling;
          let count = 0;
          while (curr && count < 20) {
            text += curr.innerText + '\\n\\n';
            curr = curr.nextElementSibling;
            count++;
          }
          return text.slice(0, 10000);
        })()`,
        returnByValue: true,
      },
      session.sessionId
    );
    console.log(`=== Section: ${targetSection} ===`);
    console.log(evalSection?.result?.value);
    client.close();
    process.exit(0);
  }

  console.log("Title:", evalRes?.result?.value?.title);
  console.log("Found headings:", evalRes?.result?.value?.headings?.length);
  evalRes?.result?.value?.headings?.forEach((h) => console.log(`[${h.tag}] ${h.text}`));

  client.close();
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
