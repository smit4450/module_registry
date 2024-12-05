import { createUser } from '../dynamodb_operations/createUser';
import { hashPassword } from '../auth/hashPassword';

export const setupAdminUser = async () => {
  const adminUsername = 'admin';
  const adminPassword = await hashPassword('admin123');
  const adminUser = {
    username: adminUsername,
    email: 'admin@example.com',
    password_hash: adminPassword,
    role: 'admin',
    created_at: new Date().toISOString(),
    last_login: null,
  };

  try {
    await createUser(adminUser);
    console.log('Admin user created successfully.');
  } catch (error) {
    console.error('Error setting up admin user:', error);
  }
};
