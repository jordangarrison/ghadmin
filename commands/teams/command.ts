import type { Builder } from '../../main.ts';
import listCommand from './list.ts';
import createCommand from './create.ts';
import deleteCommand from './delete.ts';
import membersCommand from './members/command.ts';

export const command = 'teams';
export const desc = 'Manage GitHub teams';

export const builder = (yargs: Builder) => {
  return yargs
    .command(listCommand)
    .command(createCommand)
    .command(deleteCommand)
    .command(membersCommand)
    .demandCommand(1, 'You must specify a subcommand')
    .help();
};

export default {
  command,
  desc,
  builder,
};
