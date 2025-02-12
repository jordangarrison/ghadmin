import { Octokit } from 'npm:@octokit/rest@20.0.2';
import { githubConfig } from '../../config.ts';
import {
  formatOutput,
  outputBuilder,
  type OutputOptions,
} from '../../utils/output.ts';

const octokit = new Octokit(githubConfig);

export const command = 'create <org> <name>';
export const desc = 'Create a new team';

export const builder = {
  org: {
    describe: 'GitHub organization name',
    type: 'string',
    demandOption: true,
  },
  description: {
    alias: 'd',
    describe: 'Team description',
    type: 'string',
  },
  ...outputBuilder,
};

interface CreateArgs extends OutputOptions {
  org: string;
  name: string;
  description?: string;
}

export const handler = async (argv: CreateArgs) => {
  try {
    const { data: team } = await octokit.rest.teams.create({
      org: argv.org,
      name: argv.name,
      description: argv.description,
      privacy: 'closed',
    });

    const result = {
      status: 'success',
      message: `Team "${team.name}" created successfully!`,
      details: {
        org: argv.org,
        name: team.name,
        slug: team.slug,
        description: team.description,
        privacy: team.privacy,
        permission: team.permission,
        url: team.html_url,
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
          name: argv.name,
          description: argv.description,
        },
      };
      formatOutput(errorResult, argv.format);
    }
  }
};

export default { command, desc, builder, handler };
