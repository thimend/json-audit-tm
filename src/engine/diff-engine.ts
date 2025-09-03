import { AuditEvent, AuditOptions } from "../types";

export function computeDiff(
  before: unknown,
  after: unknown,
  basePath = '',
  options: AuditOptions = {}
): AuditEvent[] {
  const events: AuditEvent[] = [];
  const isObject = (v: unknown) => v !== null && typeof v === 'object' && !Array.isArray(v);

  if (typeof before !== typeof after) {
    events.push(makeEvent(basePath, pathField(basePath), options, 'type_changed', before ?? null, after ?? null));
    return events;
  }

  if (!isObject(before) && !Array.isArray(before)) {
    if (before !== after) {
      events.push(makeEvent(basePath, pathField(basePath), options, 'modified', before ?? null, after ?? null));
    }
    return events;
  }

  if (Array.isArray(before) && Array.isArray(after)) {
    if (JSON.stringify(before) !== JSON.stringify(after)) {
      events.push(makeEvent(basePath, pathField(basePath), options, 'modified', before, after));
    }
    return events;
  }

  if (isObject(before) && isObject(after)) {
    const a = before as Record<string, unknown>;
    const b = after as Record<string, unknown>;
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);

    for (const k of keys) {
      const p = basePath ? `${basePath}.${k}` : k;
      if (shouldIgnore(p, options)) continue;

      if (!(k in a)) {
        events.push(makeEvent(p, k, options, 'included', null, b[k] ?? null));
      } else if (!(k in b)) {
        events.push(makeEvent(p, k, options, 'excluded', a[k] ?? null, null));
      } else {
        const av = a[k];
        const bv = b[k];
        if (typeof av !== typeof bv) {
          events.push(makeEvent(p, k, options, 'type_changed', av ?? null, bv ?? null));
        } else if (Array.isArray(av) && Array.isArray(bv)) {
          if (JSON.stringify(av) !== JSON.stringify(bv)) {
            events.push(makeEvent(p, k, options, 'modified', av, bv));
          }
        } else if (isObject(av) && isObject(bv)) {
          if (JSON.stringify(av) !== JSON.stringify(bv)) {
            events.push(makeEvent(p, k, options, 'modified', av, bv));
          }
        } else {
          if (av !== bv) {
            events.push(makeEvent(p, k, options, 'modified', av ?? null, bv ?? null));
          }
        }
      }
    }
  }

  return events;
}

function shouldIgnore(path: string, options: AuditOptions): boolean {
  if (!options.ignorePaths?.length) return false;
  return options.ignorePaths.includes(path);
}

function displayNameOf(field: string, path: string, options: AuditOptions): string {
  const map = options.displayNameMap || {};
  return map[path] || map[field] || field;
}

function pathField(path: string): string {
  const parts = path.split('.');
  return parts[parts.length - 1] || '';
}

function makeEvent(
  path: string,
  field: string,
  options: AuditOptions,
  action: 'included' | 'excluded' | 'modified' | 'type_changed',
  oldVal: unknown,
  newVal: unknown
) {
  return {
    path,
    field,
    displayName: displayNameOf(field, path, options),
    action,
    old: oldVal,
    new: newVal
  };
}
