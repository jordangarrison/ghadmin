import { Octokit } from 'npm:@octokit/rest@20.0.2';
import { githubConfig } from '../../../config.ts';
import {
  formatOutput,
  outputBuilder,
  type OutputOptions,
} from '../../../utils/output.ts';

const octokit = new Octokit(githubConfig);

export const command = 'add <org> <team-slug> <username>';
export const desc = 'Add a member to a team';

export const builder = {
  org: {
    describe: 'GitHub organization name',
    type: 'string',
    demandOption: true,
  },
  'team-slug': {
    describe: 'Team slug (URL-friendly name)',
    type: 'string',
    demandOption: true,
  },
  username: {
    describe: 'GitHub username to add',
    type: 'string',
    demandOption: true,
  },
  role: {
    describe: 'Role in the team',
    type: 'string',
    choices: ['member', 'maintainer'] as const,
    default: 'member',
  },
  ...outputBuilder,
};

interface AddArgs extends OutputOptions {
  org: string;
  'team-slug': string;
  username: string;
  role: 'member' | 'maintainer';
}

export const handler = async (argv: AddArgs) => {
  try {
    await octokit.rest.teams.addOrUpdateMembershipForUserInOrg({
      org: argv.org,
      team_slug: argv['team-slug'],
      username: argv.username,
      role: argv.role,
    });

    const result = {
      status: 'success',
      message: `Successfully added ${argv.username} to the team as ${argv.role}`,
      details: {
        org: argv.org,
        team: argv['team-slug'],
        username: argv.username,
        role: argv.role,
      },
    };

    formatOutput(result, argv.format);
  } catch (error: unknown) {
    if (error instanceof Error) {
      const errorResult = {
        status: 'error',
        message: error.message,
        details: {
          org: argv.org,
          team: argv['team-slug'],
          username: argv.username,
          role: argv.role,
        },
      };
      formatOutput(errorResult, argv.format);
    }
  }
};

export default { command, desc, builder, handler };
