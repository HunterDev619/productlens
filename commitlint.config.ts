import type { UserConfig } from '@commitlint/types';

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  ignores: [message => message.startsWith('chore: bump')], // Ignore dependabot commits
};
//  this
export default Configuration;
