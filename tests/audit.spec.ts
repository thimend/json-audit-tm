import { describe, it, expect } from 'vitest';
import { auditJson } from '../src';
import type { AuditInput } from '../src';

describe('auditJson (mínimo)', () => {
  it('detecta modified e included/excluded no nível raiz', () => {
    const input: AuditInput = {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Pedido 123",
      before: { cliente: "Ana", pef: 10 },
      after:  { cliente: "Ana Paula", pef: 15, novo: true },
      options: {
        displayNameMap: {
          "cliente": "Nome do Cliente",
          "pef": "PEF",
          "novo": "Novo Campo"
        }
      }
    };

    const out = auditJson(input);

    expect(out.id).toBe(input.id);
    expect(out.events.length).toBeGreaterThan(0);

    const cliente = out.events.find(e => e.path === 'cliente');
    expect(cliente?.action).toBe('modified');
    expect(cliente?.old).toBe('Ana');
    expect(cliente?.new).toBe('Ana Paula');

    const pef = out.events.find(e => e.path === 'pef');
    expect(pef?.displayName).toBe('PEF');

    const novo = out.events.find(e => e.path === 'novo');
    expect(novo?.action).toBe('included');
  });
});
