/**
 * ! Executing this script will delete all data in your database and seed it with 10 user.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from '@snaplet/seed';
import { copycat } from '@snaplet/copycat';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/auth/utils';

const main = async () => {
  const seed = await createSeedClient();

  // Truncate all tables in the database
  await seed.$resetDatabase();

  const defaultPassword = 'password';
  // Seed the database with 10 user
  await seed.user((x) =>
    x(10, {
      id: ({ seed }) => copycat.uuid(seed),
      username: ({ seed }) => copycat.username(seed),
      email: ({ seed }) => copycat.email(seed),
      salt: () => bcrypt.genSaltSync(SALT_ROUNDS),
      hash: ({ data }) =>
        bcrypt.hashSync(
          defaultPassword,
          data.salt || bcrypt.genSaltSync(SALT_ROUNDS),
        ),
    }),
  );

  // Type completion not working? You might want to reload your TypeScript Server to pick up the changes

  console.log('Database seeded successfully!');

  process.exit();
};

main();
