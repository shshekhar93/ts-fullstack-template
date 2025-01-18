import { join } from 'node:path';
import { mkdir, readdir, rm } from 'node:fs/promises';
import { exec } from 'node:child_process';
import { confirmClearWorkingDirectory } from './prompts';
import { templateZIPFilename, templateZIPFolderName, templateZipURL } from './constants';
import { createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';
import { ReadableStream } from 'node:stream/web';
import extract from 'extract-zip';

export async function prepareWorkDir() {
  const workdir = join(process.cwd(), process.argv[2] ?? '');
  await mkdir(workdir, { recursive: true });

  if (process.cwd() !== workdir) {
    process.chdir(workdir);
  }

  const workdirContents = await readdir(workdir);

  if (workdirContents.length) {
    const result = await confirmClearWorkingDirectory();

    if (!result) {
      console.error('Ok! Exiting.');
      process.exit(1);
    }

    if (result.cleanWorkDir) {
      await Promise.all(workdirContents.map((file) => {
        const fullPath = join(workdir, file);
        return rm(fullPath, { recursive: true, force: true });
      }));
    }
  }
  return workdir;
}

export async function downloadTemplate() {
  actionStart('Downloading template repo...');

  // Load file
  const response = await fetch(templateZipURL);
  if (!response.ok) {
    console.error('Unable to fetch the bootstrap zip. Are you connected to internet?');
    process.exit(1);
  }

  // Save file
  const zipFilePath = join(process.cwd(), templateZIPFilename);
  const zipFile = createWriteStream(zipFilePath);
  const responseStream = Readable.fromWeb(response.body as ReadableStream);
  await fromStream(responseStream, stream => stream.pipe(zipFile));
  actionComplete();

  // Extract from zip
  await extractTemplateZIP();
}

async function extractTemplateZIP() {
  actionStart('Extracting zip file...');
  const zipFilePath = join(process.cwd(), templateZIPFilename);
  await extract(zipFilePath, {
    dir: process.cwd(),
  });

  const command = `for i in $(ls -a ${templateZIPFolderName}/); do mv ${templateZIPFolderName}/$i ./; done`; // Unix only...
  await fromCb(cb => exec(command, err => cb(null, err)));

  await rm(templateZIPFolderName, { recursive: true, force: true });
  actionComplete();
}

export function getIssueUrl(repo: string) {
  const hasSuffix = repo.endsWith('.git');
  return repo.replace(hasSuffix ? /.git$/ : /$/, '/issues');
}

export function getReadmeUrl(repo: string) {
  const hasSuffix = repo.endsWith('.git');
  return repo.replace(hasSuffix ? /.git$/ : /$/, '#readme');
}

export function fromStream(stream: Readable, cb: (stream: Readable) => void) {
  return new Promise<void>((resolve, reject) => {
    stream.on('end', resolve);
    stream.on('error', reject);
    cb(stream);
  });
}

export function fromCb<T = null>(callee: (cb: (res: T, err?: Error | null) => void) => void) {
  return new Promise<T>((resolve, reject) => callee((res, err) => {
    if (err) {
      reject(err);
    }
    else {
      resolve(res);
    }
  }));
}

export function actionStart(message: string) {
  console.log(message);
}

export function actionComplete() {
  console.log('Done.');
}
