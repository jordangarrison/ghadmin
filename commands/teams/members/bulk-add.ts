import { Octokit } from 'npm:@octokit/rest@20.0.2';
import { githubConfig } from '../../../config.ts';
import {
  formatOutput,
  outputBuilder,
  type OutputOptions,
} from '../../../utils/output.ts';

const octokit = new Octokit(githubConfig);

export const command = 'bulk-add <org> <team-slug> <usernames>';
export const desc = 'Add multiple users to a team';

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
  usernames: {
    describe: 'Comma-separated list of GitHub usernames to add',
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

interface BulkAddArgs extends OutputOptions {
  org: string;
  'team-slug': string;
  usernames: string;
  role: 'member' | 'maintainer';
}

export const handler = async (argv: BulkAddArgs) => {
  try {
    const users = argv.usernames.split(',').map((username) => username.trim());
    const results = [];

    for (const username of users) {
      try {
        await octokit.rest.teams.addOrUpdateMembershipForUserInOrg({
          org: argv.org,
          team_slug: argv['team-slug'],
          username,
          role: argv.role,
        });

        results.push({
          username,
          status: 'success',
          message: `Successfully added ${username} to the team as ${argv.role}`,
        });
      } catch (error) {
        results.push({
          username,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const result = {
      status: 'success',
      message: `Bulk add operation completed`,
      details: {
        org: argv.org,
        team: argv['team-slug'],
        role: argv.role,
        results,
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
          usernames: argv.usernames,
          role: argv.role,
        },
      };
      formatOutput(errorResult, argv.format);
    }
  }
};

export default { command, desc, builder, handler };
