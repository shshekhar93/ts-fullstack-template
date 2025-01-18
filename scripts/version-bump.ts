import semverInc from 'semver/functions/inc';
import { readFileSync, writeFileSync } from 'fs';
import { ReleaseType } from 'semver';

const releaseType = (process.argv[2] as ReleaseType) ?? 'patch';

const filesToProcess = [
  './package.json',
  './client/package.json',
  './server/package.json',
];

filesToProcess.forEach((file) => {
  const packageFile = JSON.parse(readFileSync(file, 'utf8'));
  packageFile.version = semverInc(packageFile.version, releaseType);
  writeFileSync(file, JSON.stringify(packageFile, null, 2));
});
