# json-audit-tm

A lightweight TypeScript library to compare two JSON states and generate **structured audit logs**.  
It detects **added, removed, modified, and type-changed** fields, supports **custom display names**, **array identity keys**, and metadata such as **actor and timestamp**.  
Works with **React**, **Angular**, and **Node.js**.

---

## ✨ Features

- Deep diff between two JSON states
- Actions: `included`, `excluded`, `modified`, `type_changed`
- Friendly labels via `displayNameMap`
- Ignore specific paths with `ignorePaths`
- Array identity keys (`arrayIdentity`) for stable matching
- Policies for `null` vs missing fields and float tolerance (`numberEpsilon`)
- ESM + CJS builds, TypeScript types included
- CLI-like workflow via `npm run` to test JSON files

---

## ✅ Requirements

- **Node.js 18+**
- NPM or compatible package manager

---

## 🚀 Installation

```bash
npm install json-audit-tm
```

> In a monorepo or local dev scenario, make sure to `npm run build` before consuming the package.

---

## 📖 Usage (Library)

```ts
import { auditJson } from "json-audit-tm";

const result = auditJson({
  id: "00000000-0000-0000-0000-000000000001",
  name: "Order 123",
  before: { customer: "Ana", pef: 10, items: [{ id: 1, qty: 2 }] },
  after:  { customer: "Ana Paula", pef: 15, items: [{ id: 1, qty: 3 }, { id: 2, qty: 1 }], newField: true },
  options: {
    displayNameMap: {
      "customer": "Customer Name",
      "pef": "PEF",
      "items.qty": "Quantity",
      "newField": "New Field"
    },
    ignorePaths: ["lastUpdatedAt"],
    arrayIdentity: { items: ["id"] },
    nullPolicy: "null_is_value",
    numberEpsilon: 0.001
  }
});

console.log(JSON.stringify(result, null, 2));
```

**Example output (simplified):**

```json
{
  "id": "00000000-0000-0000-0000-000000000001",
  "auditId": "AUD-1725389572000",
  "timestamp": "2025-09-03T18:52:52.000Z",
  "name": "Order 123",
  "summary": {
    "included": 1,
    "excluded": 0,
    "modified": 2,
    "type_changed": 0,
    "total": 3
  },
  "events": [
    {
      "path": "customer",
      "field": "customer",
      "displayName": "Customer Name",
      "action": "modified",
      "old": "Ana",
      "new": "Ana Paula"
    },
    {
      "path": "pef",
      "field": "pef",
      "displayName": "PEF",
      "action": "modified",
      "old": 10,
      "new": 15
    },
    {
      "path": "newField",
      "field": "newField",
      "displayName": "New Field",
      "action": "included",
      "old": null,
      "new": true
    }
  ]
}
```

---

## ⚙️ Advanced Options

The `options` property allows you to customize the diff process:

- **displayNameMap** → map technical keys to user-friendly names  
- **ignorePaths** → skip some fields from audit  
- **arrayIdentity** → define identity keys for comparing arrays  
- **nullPolicy** → decide how `null` vs missing fields are treated  
- **numberEpsilon** → tolerance for floating-point numbers  
- **trackReorder** → track reordering of array elements  

Example:

```ts
options: {
  displayNameMap: {
    "customer.name": "Customer Name",
    "items.qty": "Quantity"
  },
  ignorePaths: ["lastUpdatedAt"],
  arrayIdentity: { items: ["id"] },
  nullPolicy: "null_equals_absent",
  numberEpsilon: 0.001,
  trackReorder: true
}
```

---

## 🧪 Testing JSON Files (CLI Mode)

Besides using the library in code, you can **test JSON files directly** with `npm run`.

### Step 1 — Generate sample files
```bash
npm run sample
```

This will create:

- `test-file/old.json`  
- `test-file/new.json`

### Step 2 — Run audit
```bash
npm run audit -- test-file/old.json test-file/new.json "order-123"
```

Output:  
A new file inside `test-file/` named like:

```
ab12cd34ef56.order-123.json
```

Inside, you will find the structured audit log.

---

## 📌 Roadmap

- [ ] Recursive deep-diff for nested objects  
- [ ] Advanced array diff (identity keys, moved detection)  
- [ ] Configurable null/absent behavior  
- [ ] Float precision handling  
- [ ] CLI binary (`json-audit`) published with NPM  

---

## 📜 License

MIT © Thiago (TM)
