import { Octokit } from 'npm:@octokit/rest@20.0.2';
import { githubConfig } from '../../../config.ts';
import {
  formatOutput,
  outputBuilder,
  type OutputOptions,
} from '../../../utils/output.ts';

const octokit = new Octokit(githubConfig);

export const command = 'invite <org> <username>';
export const desc = 'Invite a user to the organization';

export const builder = {
  org: {
    describe: 'GitHub organization name',
    type: 'string',
    demandOption: true,
  },
  username: {
    describe: 'GitHub username to invite',
    type: 'string',
    demandOption: true,
  },
  role: {
    describe: 'Role in the organization',
    type: 'string',
    choices: ['direct_member', 'admin'] as const,
    default: 'direct_member',
  },
  'team-slugs': {
    describe: 'Comma-separated list of team slugs to add the user to',
    type: 'string',
  },
  ...outputBuilder,
};

interface InviteArgs extends OutputOptions {
  org: string;
  username: string;
  role: 'direct_member' | 'admin';
  'team-slugs'?: string;
}

export const handler = async (argv: InviteArgs) => {
  try {
    // Create the organization invitation
    const { data: invitation } = await octokit.rest.orgs.createInvitation({
      org: argv.org,
      invitee_id: (
        await octokit.rest.users.getByUsername({ username: argv.username })
      ).data.id,
      role: argv.role,
    });

    let teamResults = [];

    // If team slugs are provided, add the user to those teams
    if (argv['team-slugs']) {
      const teams = argv['team-slugs'].split(',').map((slug) => slug.trim());

      for (const teamSlug of teams) {
        try {
          await octokit.rest.teams.addOrUpdateMembershipForUserInOrg({
            org: argv.org,
            team_slug: teamSlug,
            username: argv.username,
            role: 'member',
          });

          teamResults.push({
            team: teamSlug,
            status: 'success',
          });
        } catch (error) {
          teamResults.push({
            team: teamSlug,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    }

    const result = {
      status: 'success',
      message: `Successfully invited ${argv.username} to the organization`,
      details: {
        org: argv.org,
        username: argv.username,
        role: argv.role,
        invitation_id: invitation.id,
        teams: teamResults,
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
          username: argv.username,
          role: argv.role,
        },
      };
      formatOutput(errorResult, argv.format);
    }
  }
};

export default { command, desc, builder, handler };
