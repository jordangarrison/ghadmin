import { Octokit } from 'npm:@octokit/rest@20.0.2';
import { githubConfig } from '../../../config.ts';
import {
  formatOutput,
  outputBuilder,
  type OutputOptions,
} from '../../../utils/output.ts';

const octokit = new Octokit(githubConfig);

export const command = 'list-invites <org>';
export const desc = 'List pending organization invitations';

export const builder = {
  org: {
    describe: 'GitHub organization name',
    type: 'string',
    demandOption: true,
  },
  ...outputBuilder,
};

interface ListInvitesArgs extends OutputOptions {
  org: string;
}

export const handler = async (argv: ListInvitesArgs) => {
  try {
    const { data: invitations } =
      await octokit.rest.orgs.listPendingInvitations({
        org: argv.org,
        per_page: 100,
      });

    const formattedInvitations = invitations.map((invite) => ({
      id: invite.id,
      login: invite.login,
      email: invite.email,
      role: invite.role,
      created_at: invite.created_at,
      inviter: invite.inviter?.login,
      team_count: invite.team_count,
    }));

    formatOutput(formattedInvitations, argv.format);
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
