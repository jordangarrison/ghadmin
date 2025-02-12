import { Octokit } from 'npm:@octokit/rest@20.0.2';
import { githubConfig } from '../../config.ts';
import {
  formatOutput,
  outputBuilder,
  type OutputOptions,
} from '../../utils/output.ts';

const octokit = new Octokit(githubConfig);

export const command = 'delete <org> <team-slug>';
export const desc = 'Delete a team';

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
  ...outputBuilder,
};

interface DeleteArgs extends OutputOptions {
  org: string;
  'team-slug': string;
}

export const handler = async (argv: DeleteArgs) => {
  try {
    await octokit.rest.teams.deleteInOrg({
      org: argv.org,
      team_slug: argv['team-slug'],
    });

    const result = {
      status: 'success',
      message: `Team "${argv['team-slug']}" deleted successfully!`,
      details: {
        org: argv.org,
        team: argv['team-slug'],
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
        },
      };
      formatOutput(errorResult, argv.format);
    }
  }
};

export default { command, desc, builder, handler };
