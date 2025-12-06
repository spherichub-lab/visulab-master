import { supabase } from '../../lib/supabase';
import { User } from '../../types';

interface Company {
  id: string;
  name: string;
}

interface CreateUserParams {
  fullName: string;
  companyId: string;
  companyName: string;
}

export const userService = {
  // Fetch all companies for the dropdown
  getAllCompanies: async (): Promise<Company[]> => {
    const { data, error } = await supabase
      .from('companies')
      .select('id, name');
    
    if (error) {
      console.error('Error fetching companies:', error);
      throw new Error('Failed to fetch companies');
    }
    
    return data || [];
  },

  // Fetch all users from profiles
  getUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }

    // Map profile data to User interface
    return (data || []).map(profile => ({
      id: profile.id,
      name: profile.full_name,
      email: `${profile.login}.com`, // Construct email from login if not stored directly, or adjust based on schema
      role: profile.role,
      status: 'Active', // Default status as it's not in the requirements yet
      lastActive: 'N/A', // Placeholder
      initials: profile.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    }));
  },

  // Create a new user in Supabase Auth and profiles table
  createUser: async ({ fullName, companyId, companyName }: CreateUserParams) => {
    // Generate email and login
    const firstName = fullName.split(' ')[0].toLowerCase();
    const companyNameClean = companyName.toLowerCase().replace(/\s+/g, '');
    const email = `${firstName}@${companyNameClean}.com`;
    const login = `${firstName}@${companyNameClean}`;
    const password = Math.random().toString(36).slice(-8); // Generate a random password

    // Step 1: Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      throw new Error(`Failed to create auth user: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('No user returned from auth signup');
    }

    // Step 2: Create profile in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: fullName,
        company_id: companyId,
        role: 'User',
        login: login
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Attempt to clean up the auth user if profile creation fails - Note: This requires admin privileges usually
      // await supabase.auth.admin.deleteUser(authData.user.id); 
      throw new Error(`Failed to create profile: ${profileError.message}`);
    }

    return {
      id: authData.user.id,
      email,
      fullName
    };
  }
};