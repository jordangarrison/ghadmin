import yargs from 'yargs';
import teamsCommand from './commands/teams/command.ts';

export type Builder = ReturnType<typeof yargs>;

yargs(Deno.args)
  .scriptName('ghadmin')
  .command(teamsCommand)
  .demandCommand(1, 'You must specify a command')
  .help()
  .parse();
