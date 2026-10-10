import { createCdpClient } from "./queryDdb.mjs";
import fs from "fs";

async function main() {
  const client = await createCdpClient();
  const target = await client.send("Target.createTarget", { url: "https://www.dndbeyond.com/sources/dnd/vsspp2/valdas-spire-of-secrets-player-pack-2" });
  const session = await client.send("Target.attachToTarget", { targetId: target.targetId, flatten: true });

  await new Promise((r) => setTimeout(r, 4000));

  const evalRes = await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const subclasses = ["Pistolero", "College of Masks", "Dragon Domain", "Circle of the City", "Beastborne", "Magic Missile Mage"];
        const h3s = Array.from(document.querySelectorAll('h3'));
        const results = {};
        for (const sub of subclasses) {
          const h3 = h3s.find(h => h.innerText.trim().includes(sub));
          if (!h3) continue;
          let node = h3.nextElementSibling;
          const parts = [];
          while (node && node.tagName !== 'H3' && node.tagName !== 'H2') {
            parts.push(node.tagName + ': ' + node.innerText.trim());
            node = node.nextElementSibling;
          }
          results[sub] = parts.join('\\n\\n');
        }
        return results;
      })()
    `,
    returnByValue: true
  }, session.sessionId);

  fs.writeFileSync("scripts/vsspp2_subclasses_official.json", JSON.stringify(evalRes.result?.value, null, 2));
  console.log("Saved all VSSPP2 subclasses to scripts/vsspp2_subclasses_official.json!");

  await client.send("Target.closeTarget", { targetId: target.targetId });
  client.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
