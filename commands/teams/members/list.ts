import { Octokit } from 'npm:@octokit/rest@20.0.2';
import { githubConfig } from '../../../config.ts';
import {
  formatOutput,
  outputBuilder,
  type OutputOptions,
} from '../../../utils/output.ts';

const octokit = new Octokit(githubConfig);

export const command = 'list <org> <team-slug>';
export const desc = 'List all members in a team';

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

interface ListArgs extends OutputOptions {
  org: string;
  'team-slug': string;
}

export const handler = async (argv: ListArgs) => {
  try {
    const { data: members } = await octokit.rest.teams.listMembersInOrg({
      org: argv.org,
      team_slug: argv['team-slug'],
      per_page: 100,
    });

    const formattedMembers = members.map((member) => ({
      login: member.login,
      type: member.type,
      url: member.html_url,
    }));

    formatOutput(formattedMembers, argv.format);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error listing team members:', error.message);
    }
  }
};

export default { command, desc, builder, handler };
