#!/usr/bin/env node

import { projectPrompts } from './prompts';
import { setupGitRepository, setupProject } from './setup';
import { downloadTemplate, prepareWorkDir } from './utils';

async function bootstrap() {
  await prepareWorkDir();
  const responses = await projectPrompts();
  await downloadTemplate();
  await setupProject(responses);
  if (responses.repo) {
    await setupGitRepository(responses.repo);
  }
}

bootstrap();
