export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Administrator' | 'Stock Manager' | 'Viewer' | 'Manager' | 'Admin';
  status: 'Active' | 'Offline' | 'Pending' | 'Inactive';
  lastActive: string;
  avatarUrl?: string;
  initials?: string;
}

export interface Company {
  id: string;
  name: string;
  displayId: string;
  type: 'Supplier' | 'Client' | 'Partner' | 'Head Office' | 'Branch';
  contactName: string;
  contactEmail: string;
  status: 'Active' | 'Inactive' | 'Pending';
  initials: string;
  colorClass: string;
}

export interface Purchase {
  id: string;
  displayId: string;
  supplier: string;
  supplierInitials: string;
  supplierColorClass: string;
  date: string;
  itemsDescription: string;
  amount: number;
  status: 'Received' | 'Pending' | 'Cancelled';
}

export interface ShortageFormData {
  material: string; // Refractive Index
  lensType: string; // Type
  coating: string; // Treatment
  sphere: string;
  cylinder: string;
  quantity: number;
}