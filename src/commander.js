/* eslint-disable no-console */
import { Command } from 'commander';

const program = new Command();

program
  .option(
    '-m, --mode <string>',
    'Set the mode for server start (dev|prod)',
    'dev',
  )
  .option(
    '--mongo-type <string>',
    'Set the MongoDB deployment type (atlas|local)',
    'local',
  )
  .parse();

const options = program.opts();

const args = [
  {
    argName: 'mode',
    envName: 'NODE_ENV',
    validValues: ['dev', 'prod'],
  },
  {
    argName: 'mongoType',
    envName: 'MONGO_TYPE',
    validValues: ['atlas', 'local'],
  },
];

args.forEach(({ argName, envName, validValues }) => {
  if (!validValues.includes(options[argName])) {
    console.error(
      `Invalid value for ${argName} flag. Provided value: ${options[argName]}. Must be one of: ${validValues.join(', ')}`,
    );
    process.exit(1);
  }
  process.env[envName] ??= options[argName]; // Assign value of arg to process.env if it's not already set
});
