import { createCdpClient } from "./queryDdb.mjs";

async function main() {
  const client = await createCdpClient();
  const target = await client.send("Target.createTarget", { url: "https://www.dndbeyond.com/sources/dnd/vsspp2/valdas-spire-of-secrets-player-pack-2" });
  const session = await client.send("Target.attachToTarget", { targetId: target.targetId, flatten: true });

  await new Promise((r) => setTimeout(r, 4000));

  const evalRes = await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const h3s = Array.from(document.querySelectorAll('h3'));
        const heroicH3 = h3s.find(h => h.innerText.includes('Heroic Sorcery'));
        if (!heroicH3) return 'Heroic Sorcery not found';
        
        let node = heroicH3.nextElementSibling;
        const parts = [];
        while (node && node.tagName !== 'H3' && node.tagName !== 'H2') {
          parts.push(node.tagName + ': ' + node.innerText.trim());
          node = node.nextElementSibling;
        }
        return parts.join('\\n\\n');
      })()
    `,
    returnByValue: true
  }, session.sessionId);

  console.log("EXACT OFFICIAL D&D BEYOND TEXT FOR HEROIC SORCERY:");
  console.log(evalRes.result?.value);

  await client.send("Target.closeTarget", { targetId: target.targetId });
  client.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
