// app/utils/cba.server.ts
export function calculateCBA(alePrior: number, alePost: number, acs: number): number {
    return alePrior - alePost - acs;
  }
  