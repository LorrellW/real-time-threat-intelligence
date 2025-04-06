// app/routes/api/cache.ts
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getThreatData } from "~/utils/cache.server";

export const action: ActionFunction = async ({ request }) => {
  const { ip } = await request.json();
  const data = await getThreatData(ip);
  return json({ data });
};
