import { Octokit } from 'npm:@octokit/rest@20.0.2';
import { githubConfig } from '../../../config.ts';
import {
  formatOutput,
  outputBuilder,
  type OutputOptions,
} from '../../../utils/output.ts';

const octokit = new Octokit(githubConfig);

export const command = 'remove <org> <team-slug> <username>';
export const desc = 'Remove a member from a team';

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
    describe: 'GitHub username to remove',
    type: 'string',
    demandOption: true,
  },
  ...outputBuilder,
};

interface RemoveArgs extends OutputOptions {
  org: string;
  'team-slug': string;
  username: string;
}

export const handler = async (argv: RemoveArgs) => {
  try {
    await octokit.rest.teams.removeMembershipForUserInOrg({
      org: argv.org,
      team_slug: argv['team-slug'],
      username: argv.username,
    });

    const result = {
      status: 'success',
      message: `Successfully removed ${argv.username} from the team`,
      details: {
        org: argv.org,
        team: argv['team-slug'],
        username: argv.username,
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
        },
      };
      formatOutput(errorResult, argv.format);
    }
  }
};

export default { command, desc, builder, handler };
