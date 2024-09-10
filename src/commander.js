/* eslint-disable no-console */
import { Command } from 'commander';

const program = new Command();

const options = program
  .option(
    '-m, --mode <mode>',
    'Set the mode for server start (dev|prod)',
    'dev',
  )
  .option(
    '--mongo-type <mongoType>',
    'Set the MongoDB deployment type (atlas|local)',
    'local',
  )
  .parse()
  .opts();

const validOptions = {
  mode: ['dev', 'prod'],
  mongoType: ['atlas', 'local'],
};

Object.entries(validOptions).forEach(([arg, validValues]) => {
  if (!validValues.includes(options[arg])) {
    console.error(
      `Invalid value for ${arg} flag. Provided value: ${options[arg]}. Must be one of: ${validValues.join(', ')}`,
    );
    process.exit(1);
  }
  process.env[arg.toUpperCase()] ??= options[arg]; // Assign value of arg to process.env if it's not already set
});
