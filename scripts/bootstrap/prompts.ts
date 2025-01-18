import { basename } from 'path';
import prompts, { PromptObject } from 'prompts';

export type ProjectResponse = {
  projectName: string;
  description: string;
  repo: string;
  author: string;
  autoInstall: boolean;
};

const projectQuestions: PromptObject<keyof ProjectResponse>[] = [{
  type: 'text',
  name: 'projectName',
  message: 'Project name?',
  initial: basename(process.cwd()),
}, {
  type: 'text',
  name: 'description',
  message: 'Project description?',
}, {
  type: 'text',
  name: 'repo',
  message: 'Project\'s git repository?',
}, {
  type: 'text',
  name: 'author',
  message: 'Author?',
}, {
  type: 'toggle',
  name: 'autoInstall',
  message: 'Do you want to automatically install dependencies?',
  active: 'yes',
  inactive: 'no',
  initial: true,
}];

const workingDirNotEmptyQuestions: PromptObject[] = [{
  type: 'toggle',
  name: 'cleanWorkDir',
  message: `Clear working directory (${process.cwd()})?`,
  active: 'yes',
  inactive: 'no',
}, {
  type: 'toggle',
  name: 'confirm',
  message: (prev: boolean) => (prev
    ? 'All contents of the working directory will be permanently deleted. Are you sure?'
    : 'The template contents will be merged with existing files in the working directory, some files may be overwritten and lost. Are you sure?'),
  active: 'yes',
  inactive: 'no',
}];

export async function confirmClearWorkingDirectory() {
  const { cleanWorkDir, confirm } = await prompts(workingDirNotEmptyQuestions);
  return confirm ? { cleanWorkDir } : undefined;
}

export async function projectPrompts() {
  return await prompts(projectQuestions);
}
