import { readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { exec, ExecException } from 'node:child_process';
import { type ProjectResponse } from './prompts';
import { actionComplete, actionStart, fromCb, getIssueUrl, getReadmeUrl } from './utils';
import { packageFiles, pathsToRemove } from './constants';

export async function setupProject({
  projectName = '',
  description = '',
  repo = '',
  author = '',
  autoInstall = true,
}: ProjectResponse) {
  actionStart('Setting up project...');
  const issuesUrl = repo ? getIssueUrl(repo) : undefined;
  const readMeUrl = repo ? getReadmeUrl(repo) : undefined;

  for (const packageFile of packageFiles) {
    // Read package.json
    const packagePath = join(process.cwd(), packageFile.path);
    const contents = JSON.parse(await readFile(packagePath, 'utf-8'));

    // Update the fields in template package.json
    contents.name = `${projectName}${packageFile.nameSuffix}`;
    contents.description = description;
    contents.repository.url = repo;
    contents.bugs.url = issuesUrl;
    contents.homepage = readMeUrl;
    contents.author = author;

    // Remove fields related to bootstrap.
    packageFile.fieldsToRemove.forEach((field) => {
      const fieldParts = field.split(/[.[\]]/).filter(part => part !== '');
      const fieldToRemove = fieldParts.pop();
      const objToRemoveFieldFrom = fieldParts.reduce((obj, part) => obj?.[part], contents);

      if (fieldToRemove && objToRemoveFieldFrom) {
        delete objToRemoveFieldFrom[fieldToRemove];
      }
    });

    // Write the package.json back
    await writeFile(packagePath, JSON.stringify(contents, null, 2));
  }

  await deleteSetupFiles();
  actionComplete();

  if (autoInstall) {
    await installDependencies();
  }
}

async function deleteSetupFiles() {
  return Promise.all(pathsToRemove.map(
    path => rm(join(process.cwd(), path), { recursive: true, force: true }),
  ));
}

async function installDependencies() {
  actionStart('Installing dependencies...');
  const workDir = process.cwd();
  await fromCb(cb => exec('npm install', { cwd: workDir }, err => cb(null, err)));
  actionComplete();
}

export async function setupGitRepository(repo: string) {
  actionStart('Initializing git repository...');
  try {
    await fromCb(cb => exec('git init && git add . && git commit -nm "Initial commit with fullstack boilerplate"', err => cb(null, err)));
    await fromCb(cb => exec(`git add .`, err => cb(null, err)));
    await fromCb(cb => exec(`git add .`, err => cb(null, err)));
    await fromCb(cb => exec(`git remote add origin ${repo}`, err => cb(null, err)));
  }
  catch (e) {
    if (![126, 127].includes((e as ExecException).code ?? 0)) {
      throw e;
    }
    console.warn('Unable to initialize git repository.. Is `git` installed?');
  }
  actionComplete();
}
