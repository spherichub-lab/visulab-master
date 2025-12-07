export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Administrator' | 'Stock Manager' | 'Viewer' | 'Manager' | 'Admin' | 'User';
  status: 'Active' | 'Offline' | 'Pending' | 'Inactive';
  lastActive: string;
  avatarUrl?: string;
  initials?: string;
}

export interface Company {
  id: string;
  name: string;
  display_id?: string;
  type?: 'Supplier' | 'Client' | 'Partner' | 'Head Office' | 'Branch' | 'Matriz' | 'Filial' | 'Fornecedor';
  contact_name?: string;
  contact_email?: string;
  status?: 'Active' | 'Inactive' | 'Pending';
  initials?: string;
  color_class?: string;
  created_at?: string;
}

export interface CreateCompanyParams {
  name: string;
  type?: Company['type'];
  contact_name?: string;
  contact_email?: string;
  status?: Company['status'];
}

export interface ShortageFormData {
  material: string; // Refractive Index
  lensType: string; // Type
  coating: string; // Treatment
  sphere: string;
  cylinder: string;
  quantity: number;
}

export interface Purchase {
  id: string;
  displayId: string;
  supplier: string;
  supplierInitials?: string;
  supplierColorClass?: string;
  date: string;
  itemsDescription: string;
  amount: number;
  status: 'Pending' | 'Received' | 'Cancelled';
}