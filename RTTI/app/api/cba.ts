// app/routes/api/cba.ts
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { calculateCBA } from "~/utils/cba.server";

export const action: ActionFunction = async ({ request }) => {
  const { alePrior, alePost, acs } = await request.json();
  const result = calculateCBA(alePrior, alePost, acs);
  return json({ cbaResult: result });
};
