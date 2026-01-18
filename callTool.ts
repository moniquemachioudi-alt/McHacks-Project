// lib/callTool.ts
/*export async function callTool(tool: string, input: any) {

  const res = await fetch("/api/mcp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name: tool, arguments: input },
      id: 1,
    }),
  });

  // 1️⃣ Check if response failed (network/server)
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MCP call failed: ${res.status} ${text}`);
  }

  // 2️⃣ Parse JSON safely
  let data: any;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error("Failed to parse MCP response as JSON");
  }

  // 3️⃣ Check if MCP returned an error
  if (data.error) {
    throw new Error(`MCP error: ${data.error.message || JSON.stringify(data.error)}`);
  }

  // 4️⃣ Ensure result exists
  if (!data.result) {
    throw new Error("MCP call succeeded but returned no result");
  }

  return data.result;
}



*/

export async function callTool(tool: string, input: any) {
  const res = await fetch("/api/mcp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name: tool, arguments: input },
      id: 1,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MCP call failed: ${res.status} ${text}`);
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.result;
}
