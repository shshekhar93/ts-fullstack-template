export const templateZIPFilename = 'ts-fullstack-template.zip';
export const templateZIPFolderName = 'ts-fullstack-template-main';
export const templateZipURL = 'https://github.com/shshekhar93/ts-fullstack-template/archive/refs/heads/main.zip';

export const pathsToRemove = [
  'package-lock.json',
  'scripts/bootsrtap',
  templateZIPFilename,
];

export const bootstrapPackageFields = [
  'dependencies',
  'files',
  'bin',
];

export const packageFiles = [
  { path: 'package.json', nameSuffix: '', fieldsToRemove: bootstrapPackageFields },
  { path: 'client/package.json', nameSuffix: '-client', fieldsToRemove: [] },
  { path: 'server/package.json', nameSuffix: '-server', fieldsToRemove: [] },
];
