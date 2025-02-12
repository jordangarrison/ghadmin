import type { Builder } from '../../../main.ts';
import listCommand from './list.ts';
import addCommand from './add.ts';
import removeCommand from './remove.ts';
import inviteCommand from './invite.ts';
import listInvitesCommand from './list-invites.ts';
import bulkAddCommand from './bulk-add.ts';

export const command = 'members';
export const desc = 'Manage team members';

export const builder = (yargs: Builder) => {
  return yargs
    .command(listCommand)
    .command(addCommand)
    .command(removeCommand)
    .command(inviteCommand)
    .command(listInvitesCommand)
    .command(bulkAddCommand)
    .demandCommand(1, 'You must specify a subcommand')
    .help();
};

export default { command, desc, builder };
