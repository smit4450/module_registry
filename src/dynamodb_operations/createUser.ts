import readline from 'readline';
import { createUser } from './createUser'; // Adjust the path if needed

const promptUser = (query: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans.trim());
  }));
};

(async () => {
  try {
    console.log('Creating a new user...');

    // Prompt for user details
    const username = await promptUser('Enter username: ');
    const email = await promptUser('Enter email: ');
    const password = await promptUser('Enter password: ');
    const role = await promptUser('Enter role (admin/user): ');

    // Call the function to create a user
    const result = await createUser({ username, email, password, role });

    console.log('User created successfully:', result);
  } catch (error) {
    console.error('Error creating user:', error);
  }
})();
