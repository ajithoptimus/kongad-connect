export function emitTelemetry(event: string, payload: Record<string, unknown>): void {
  // Silent capture of data trends, routing to FastAPI/PostgreSQL backend in production.
  console.log(`[Sentinel Layer] ${event}`, payload);
}
