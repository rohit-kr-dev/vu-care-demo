import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import vm from 'node:vm';

const root = resolve(import.meta.dirname, '..');
const outputPath = resolve(root, 'database', 'seed-data.json');
const source = await readFile(resolve(root, 'dist', 'app.js'), 'utf8');
const start = source.indexOf('const seed =');
const end = source.indexOf('\nlet db;', start);
if (start < 0 || end < 0) throw new Error('Could not locate the CRM seed in dist/app.js.');
const context = {};
vm.runInNewContext(`${source.slice(start, end)}; globalThis.output = seed;`, context, { timeout: 1000 });
const seed = context.output;
const collectionMap = { leads: 'leads', jobs: 'jobs', customers: 'customers', services: 'services', technicians: 'technicians', amcs: 'amcs', quotations: 'quotations', invoices: 'invoices', inventory: 'inventory', expenses: 'expenses', vendors: 'vendors', tickets: 'tickets', auditLogs: 'auditLogs', notifications: 'notifications' };
const collections = {};
for (const [seedKey, collection] of Object.entries(collectionMap)) {
  collections[collection] = (seed[seedKey] || []).map((record, index) => ({ ...record, id: String(record.id ?? `${collection}-${index + 1}`), createdAt: record.createdAt || record.date || new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString() }));
}
const payload = { format: 'vucare-firestore-seed-v1', generatedAt: new Date().toISOString(), project: 'crm-demo-9a7ec', collections, configuration: { workspaces: seed.workspaces, permissions: seed.permissions || {}, activity: seed.activity || [] }, migrationNotes: ['Import records under crm/{collection}/{recordId}.', 'Keep vucare_crm/state until the application reads granular collections.', 'Do not import seed.users into /users: map Firebase Auth UIDs to staff profiles first.'] };
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
const count = Object.values(collections).reduce((total, records) => total + records.length, 0);
console.log(`Prepared ${count} records across ${Object.keys(collections).length} Firestore collections.`);
