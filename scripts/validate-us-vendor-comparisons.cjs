#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const moduleCache = new Map();

function resolveTsPath(fromDir, specifier) {
  const directPath = path.resolve(fromDir, specifier);
  const candidates = [
    directPath,
    `${directPath}.ts`,
    `${directPath}.tsx`,
    path.join(directPath, 'index.ts'),
    path.join(directPath, 'index.tsx'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  throw new Error(`Unable to resolve module "${specifier}" from "${fromDir}".`);
}

function loadTsModule(filePath) {
  const absolutePath = path.resolve(filePath);
  if (moduleCache.has(absolutePath)) {
    return moduleCache.get(absolutePath).exports;
  }

  const source = fs.readFileSync(absolutePath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    fileName: absolutePath,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;

  const module = { exports: {} };
  moduleCache.set(absolutePath, module);

  const dirname = path.dirname(absolutePath);
  const localRequire = (specifier) => {
    if (specifier.startsWith('.')) {
      const resolved = resolveTsPath(dirname, specifier);
      return loadTsModule(resolved);
    }
    return require(specifier);
  };

  const context = vm.createContext({
    module,
    exports: module.exports,
    require: localRequire,
    __dirname: dirname,
    __filename: absolutePath,
    console,
    process,
    Buffer,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
  });

  new vm.Script(transpiled, { filename: absolutePath }).runInContext(context);
  return module.exports;
}

function validateUSVendorComparisons(alternatives) {
  const failures = [];
  let comparedVendors = 0;

  for (const alternative of alternatives) {
    const comparisons = alternative.usVendorComparisons ?? [];

    if (alternative.replacesUS.length > 0 && comparisons.length === 0) {
      failures.push(`${alternative.id}: missing usVendorComparisons despite replacesUS entries.`);
      continue;
    }

    const seenIds = new Set();
    for (const vendor of comparisons) {
      comparedVendors += 1;

      if (!vendor.name || typeof vendor.name !== 'string') {
        failures.push(`${alternative.id}: vendor entry has an invalid name.`);
      }

      if (vendor.trustScoreStatus === 'ready') {
        // Ready vendors must have reservations — a profile without reservations is not "ready"
        const reservations = vendor.reservations ?? [];
        if (reservations.length === 0) {
          failures.push(
            `${alternative.id}:${vendor.id} has trustScoreStatus="ready" but zero reservations.`,
          );
        }
        if (typeof vendor.trustScore !== 'number') {
          failures.push(
            `${alternative.id}:${vendor.id} has trustScoreStatus="ready" but missing numeric trustScore.`,
          );
        }
      } else if (vendor.trustScoreStatus !== 'pending') {
        failures.push(
          `${alternative.id}:${vendor.id} has unexpected trustScoreStatus="${String(vendor.trustScoreStatus)}".`,
        );
      }

      if (seenIds.has(vendor.id)) {
        failures.push(`${alternative.id}: duplicate vendor id "${vendor.id}" in usVendorComparisons.`);
      } else {
        seenIds.add(vendor.id);
      }
    }
  }

  return { failures, comparedVendors };
}

const projectRoot = path.resolve(__dirname, '..');
const { alternatives } = loadTsModule(path.join(projectRoot, 'src/data/alternatives.ts'));
const { failures, comparedVendors } = validateUSVendorComparisons(alternatives);

if (failures.length > 0) {
  console.error('US vendor comparison validation failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Validated ${comparedVendors} US vendor comparison entries across ${alternatives.length} alternatives.`);
