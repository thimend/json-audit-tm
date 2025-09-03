import { AuditInput, AuditOutput, AuditSummary } from "./types";
import { computeDiff } from "./engine/diff-engine";

export * from "./types";

export function auditJson(input: AuditInput): AuditOutput {
  const { id, name, before, after, actor, options } = input;
  const events = computeDiff(before, after, '', options);
  const summary = summarize(events);

  return {
    id,
    auditId: generateAuditId(),
    timestamp: new Date().toISOString(),
    actor,
    name,
    summary,
    events
  };
}

function summarize(events: AuditOutput['events']): AuditSummary {
  const s: AuditSummary = { included: 0, excluded: 0, modified: 0, type_changed: 0, total: 0 };

  for (const e of events) {
    if (e.action === 'included') s.included++;
    else if (e.action === 'excluded') s.excluded++;
    else if (e.action === 'modified') s.modified++;
    else if (e.action === 'type_changed') s.type_changed++;
  }

  s.total = events.length;
  return s;
}

function generateAuditId(): string {
  return `AUD-${Date.now()}`;
}
