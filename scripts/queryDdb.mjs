import fs from "fs";
import path from "path";

/**
 * Brave Browser D&D Beyond Extraction Tool
 * Connects directly to the user's running Brave Browser via Chrome DevTools Protocol.
 */
export async function getBraveWsUrl() {
  const localAppData = process.env.LOCALAPPDATA;
  if (!localAppData) {
    throw new Error("LOCALAPPDATA environment variable not defined.");
  }
  const devToolsPath = path.join(
    localAppData,
    "BraveSoftware",
    "Brave-Browser",
    "User Data",
    "DevToolsActivePort"
  );
  if (!fs.existsSync(devToolsPath)) {
    throw new Error(`DevToolsActivePort not found at ${devToolsPath}`);
  }

  const lines = fs.readFileSync(devToolsPath, "utf8").trim().split("\n");
  const port = lines[0].trim();
  const browserPath = lines[1].trim();
  return `ws://127.0.0.1:${port}${browserPath}`;
}

export async function createCdpClient() {
  const wsUrl = await getBraveWsUrl();
  const ws = new WebSocket(wsUrl);

  let msgId = 1;
  const pending = new Map();

  function send(method, params = {}, sessionId = undefined) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      const payload = { id, method, params };
      if (sessionId) {
        payload.sessionId = sessionId;
      }
      ws.send(JSON.stringify(payload));
    });
  }

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.id && pending.has(data.id)) {
        const { resolve, reject } = pending.get(data.id);
        pending.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    } catch (e) {
      // Ignore non-json or unhandled
    }
  };

  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });

  return {
    send,
    close: () => ws.close(),
  };
}

async function main() {
  const args = process.argv.slice(2);
  const client = await createCdpClient();

  if (args.includes("--targets")) {
    const res = await client.send("Target.getTargets");
    const pages = res.targetInfos.filter((t) => t.type === "page");
    console.log(`Found ${pages.length} open pages:`);
    pages.forEach((p) => console.log(`- [${p.title}] (${p.url}) ID: ${p.targetId}`));
    client.close();
    process.exit(0);
  }

  const urlIndex = args.indexOf("--url");
  const targetUrl = urlIndex !== -1 ? args[urlIndex + 1] : null;

  if (targetUrl) {
    console.log(`Fetching from Brave: ${targetUrl}`);
    const newTarget = await client.send("Target.createTarget", { url: targetUrl });
    const session = await client.send("Target.attachToTarget", {
      targetId: newTarget.targetId,
      flatten: true,
    });

    // Wait for content load
    await new Promise((r) => setTimeout(r, 4500));

    // Extract page title & main text via flat session
    const evalRes = await client.send(
      "Runtime.evaluate",
      {
        expression: `(() => {
          const content = document.querySelector('.content-container') || document.querySelector('main') || document.body;
          return {
            title: document.title,
            text: content ? content.innerText.slice(0, 10000) : ''
          };
        })()`,
        returnByValue: true,
      },
      session.sessionId
    );

    if (evalRes?.result?.value) {
      console.log(`=== Title: ${evalRes.result.value.title} ===`);
      console.log(evalRes.result.value.text);
    } else {
      console.log("Raw Response:", JSON.stringify(evalRes, null, 2));
    }
    await client.send("Target.closeTarget", { targetId: newTarget.targetId });
    client.close();
    process.exit(0);
  }

  console.log("Usage: node scripts/queryDdb.mjs [--targets] [--url <URL>]");
  client.close();
  process.exit(0);
}

if (process.argv[1]?.endsWith("queryDdb.mjs")) {
  main().catch((err) => {
    console.error("CDP Error:", err);
    process.exit(1);
  });
}
