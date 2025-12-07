// Utility functions for company branding (icons and colors)

export interface CompanyBranding {
    initials: string;
    colorClass: string;
}

const companyBrandingMap: Record<string, CompanyBranding> = {
    'Master': {
        initials: 'M',
        colorClass: 'bg-orange-100 text-orange-600'
    },
    'AMX': {
        initials: 'A',
        colorClass: 'bg-red-100 text-red-600'
    },
    'Ultra Optics': {
        initials: 'UO',
        colorClass: 'bg-blue-100 text-blue-600'
    },
    'GBO': {
        initials: 'G',
        colorClass: 'bg-green-100 text-green-600'
    }
};

export const getCompanyBranding = (companyName: string): CompanyBranding => {
    // Check if we have a specific branding for this company
    if (companyBrandingMap[companyName]) {
        return companyBrandingMap[companyName];
    }

    // Default fallback: generate initials and use a default color
    const initials = companyName
        .split(' ')
        .map(word => word[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    return {
        initials,
        colorClass: 'bg-slate-100 text-slate-600'
    };
};

export const getCompanyInitials = (companyName: string): string => {
    return getCompanyBranding(companyName).initials;
};

export const getCompanyColorClass = (companyName: string): string => {
    return getCompanyBranding(companyName).colorClass;
};
