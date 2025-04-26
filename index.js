#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const initCommand = require('./commands/init');
const generateCommand = require('./commands/generate');
const docsCommand = require('./commands/docs');
const deployCommand = require('./commands/deploy');

const program = new Command();

program
    .name('auto-docs')
    .description('CLI tool for automating API documentation')
    .version('1.0.0');

// Register commands
program
    .command('init')
    .description('Initialize repository for documentation automation')
    .action(initCommand);

program
    .command('generate')
    .description('Generate OpenAPI spec file from source code')
    .action(generateCommand);

program
    .command('docs')
    .description('Generate documentation from OpenAPI spec')
    .action(docsCommand);

program
    .command('deploy')
    .description('Deploy generated documentation')
    .action(deployCommand);

// Show help if no arguments are passed
if (!process.argv.slice(2).length) {
    program.help();
}
program.parse(process.argv);
