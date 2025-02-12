import { Octokit } from 'npm:@octokit/rest@20.0.2';
import { githubConfig } from '../../config.ts';
import {
  formatOutput,
  outputBuilder,
  type OutputOptions,
} from '../../utils/output.ts';

const octokit = new Octokit(githubConfig);

export const command = 'list <org>';
export const desc = 'List all teams in an organization';

export const builder = {
  org: {
    describe: 'GitHub organization name',
    type: 'string',
    demandOption: true,
  },
  ...outputBuilder,
};

interface ListArgs extends OutputOptions {
  org: string;
}

export const handler = async (argv: ListArgs) => {
  try {
    const { data: teams } = await octokit.rest.teams.list({
      org: argv.org,
      per_page: 100,
    });

    const formattedTeams = teams.map((team) => ({
      name: team.name,
      slug: team.slug,
      description: team.description,
      permission: team.permission,
      privacy: team.privacy ?? 'N/A',
    }));

    formatOutput(formattedTeams, argv.format);
  } catch (error: unknown) {
    if (error instanceof Error) {
      const errorResult = {
        status: 'error',
        message: error.message,
        details: {
          org: argv.org,
        },
      };
      formatOutput(errorResult, argv.format);
    }
  }
};

export default { command, desc, builder, handler };
