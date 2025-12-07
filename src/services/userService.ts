import { supabase } from '../../lib/supabaseClient';
import { User, Company, CreateCompanyParams } from '../../types';

interface CreateUserParams {
  fullName: string;
  companyId: string;
  companyName: string;
  password?: string;
}

export const userService = {
  // --- Company Operations ---

  // Fetch all companies
  getAllCompanies: async (): Promise<Company[]> => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching companies:', error);
      throw new Error('Failed to fetch companies');
    }

    return data || [];
  },

  // Create a new company
  createCompany: async (company: CreateCompanyParams) => {
    const dbCompany = {
      name: company.name,
      type: company.type,
      contact_name: company.contact_name,
      contact_email: company.contact_email,
      status: company.status || 'Active'
    };

    const { data, error } = await supabase
      .from('companies')
      .insert(dbCompany)
      .select()
      .single();

    if (error) {
      console.error('Error creating company:', error);
      throw new Error('Failed to create company');
    }

    return data;
  },

  // Update a company
  updateCompany: async (id: string, updates: Partial<CreateCompanyParams>) => {
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.type) dbUpdates.type = updates.type;
    if (updates.contact_name) dbUpdates.contact_name = updates.contact_name;
    if (updates.contact_email) dbUpdates.contact_email = updates.contact_email;
    if (updates.status) dbUpdates.status = updates.status;

    const { data, error } = await supabase
      .from('companies')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating company:', error);
      throw new Error('Failed to update company');
    }

    return data;
  },

  // Delete a company
  deleteCompany: async (id: string) => {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting company:', error);
      throw new Error('Failed to delete company');
    }
  },

  // --- User Operations ---

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
      email: profile.login ? (profile.login.includes('@') ? profile.login : `${profile.login}.com`) : 'N/A',
      role: profile.role,
      status: 'Active', // Default status
      lastActive: 'N/A', // Placeholder
      initials: profile.full_name ? profile.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : '??'
    }));
  },

  // Create a new user in Supabase Auth and profiles table
  createUser: async ({ fullName, companyId, companyName, password }: CreateUserParams) => {
    // Generate email and login
    const firstName = fullName.split(' ')[0].toLowerCase();
    const companyNameClean = companyName.toLowerCase().replace(/\s+/g, '');
    const email = `${firstName}@${companyNameClean}.com`;
    const login = `${firstName}@${companyNameClean}`; // Using login as email-like username
    const userPassword = password || '123456'; // Default password if not provided

    // Step 1: Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: userPassword,
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
      // Note: We might want to cleanup auth user here if profile creation fails
      throw new Error(`Failed to create profile: ${profileError.message}`);
    }

    return {
      id: authData.user.id,
      email,
      fullName
    };
  },

  // Update user profile (name and password)
  updateProfile: async (id: string, updates: { fullName?: string; password?: string }) => {
    // Update profile data
    if (updates.fullName) {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: updates.fullName })
        .eq('id', id);

      if (error) {
        console.error('Error updating profile:', error);
        throw new Error('Failed to update profile');
      }
    }

    // Update password if provided
    if (updates.password) {
      const { error } = await supabase.auth.updateUser({
        password: updates.password
      });

      if (error) {
        console.error('Error updating password:', error);
        throw new Error('Failed to update password');
      }
    }
  },

  // Delete a user
  deleteUser: async (id: string) => {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }
};