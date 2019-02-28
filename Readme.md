# Knex.js TypeScript issue

This repo demonstrates how knex.js breaks for us when upgrading from 0.15 to 0.16.

## Example workflow

```
yarn
yarn docker:up
yarn db:create
yarn db:migrate:latest
yarn db:migrate:make example-migration
```

This works just fine under 0.15.2!

## Symptom

After upgrading to 0.16.3, this happens:

```
jrr@jrrmbp ~/~/d/2019.02.12-knex-ts-issue (master)> yarn db:migrate:latest
yarn run v1.13.0
$ knex migrate:latest
Requiring external module ts-node/register

/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/knex/bin/utils/cli-config-utils.js:8
    throw new Error(
          ^
Error: No default configuration file '/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/knexfile.js' found and no commandline connection parameters passed
    at mkConfigObj (/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/knex/bin/utils/cli-config-utils.js:8:11)
    at initKnex (/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/knex/bin/cli.js:55:42)
    at Command.commander.command.description.action (/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/knex/bin/cli.js:190:17)
    at Command.listener (/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/commander/index.js:315:8)
    at Command.emit (events.js:189:13)
    at Command.parseArgs (/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/commander/index.js:654:12)
    at Command.parse (/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/commander/index.js:474:21)
    at Liftoff.invoke (/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/knex/bin/cli.js:278:13)
    at Liftoff.execute (/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/liftoff/index.js:203:12)
    at module.exports (/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/flagged-respawn/index.js:51:3)
    at Liftoff.<anonymous> (/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/liftoff/index.js:195:5)
    at /Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/liftoff/index.js:165:9
    at /Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/v8flags/index.js:135:14
    at /Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/v8flags/index.js:41:14
    at /Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/v8flags/index.js:53:7
    at process._tickCallback (internal/process/next_tick.js:61:11)
error Command failed with exit code 1.
```

So, it fails to find knexfile.ts the way it used to. A workaround is to specify the knex file, with e.g. `./node_modules/.bin/knex --knexfile knexfile.ts migrate:latest`.

Creating a migration fails with a different symptom:

```
jrr@jrrmbp ~/~/d/2019.02.12-knex-ts-issue (master)> ./node_modules/.bin/knex migrate:make example
Requiring external module ts-node/register
Using environment: development
TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string. Received type undefined
    at assertPath (path.js:39:11)
    at Object.resolve (path.js:1085:7)
    at directories.map.directory (/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/knex/lib/migrate/MigrationGenerator.js:82:28)
    at Array.map (<anonymous>)
    at MigrationGenerator._absoluteConfigDirs (/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/knex/lib/migrate/MigrationGenerator.js:81:24)
    at MigrationGenerator._ensureFolder (/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/knex/lib/migrate/MigrationGenerator.js:41:23)
    at MigrationGenerator.make (/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/knex/lib/migrate/MigrationGenerator.js:35:17)
    at Migrator.make (/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/knex/lib/migrate/Migrator.js:122:27)
    at Command.commander.command.description.option.action (/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/knex/bin/cli.js:179:10)
    at Command.listener (/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/commander/index.js:315:8)
    at Command.emit (events.js:189:13)
    at Command.parseArgs (/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/commander/index.js:654:12)
    at Command.parse (/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/commander/index.js:474:21)
    at Liftoff.invoke (/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/knex/bin/cli.js:278:13)
    at Liftoff.execute (/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/liftoff/index.js:203:12)
    at module.exports (/Users/jrr/~/datedwork/2019.02.12-knex-ts-issue/node_modules/flagged-respawn/index.js:51:3)
```

Similarly, this can be worked around by specifying `--knexfile` explicitly:

`./node_modules/.bin/knex --knexfile knexfile.ts  migrate:make example-migration`

..but this will produce a .js migration instead of .ts like 0.15 does.

To work around _that_, add `-x ts`:

`./node_modules/.bin/knex --knexfile knexfile.ts migrate:make -x ts example-migration`