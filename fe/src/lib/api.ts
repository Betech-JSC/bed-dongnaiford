import { cache } from 'react';

function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('dongnaiford')) {
      return 'https://cms.dongnaiford.com.vn/api';
    }
    if (hostname.includes('betech-digital.com')) {
      return 'https://cms.dnf.betech-digital.com/api';
    }
  }
  return 'https://dongnaiford.com.vn/api';
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${getApiBaseUrl()}${endpoint}`;
  const method = options?.method?.toUpperCase() || 'GET';
  
  // ISR Cache: API GET requests được cache 300s mặc định kết hợp tag cms-data
  // Khi CMS publish thay đổi, gọi /api/revalidate để purge cache tức thì
  const defaultCacheOption = method === 'GET' && !options?.cache && !options?.next
    ? { next: { revalidate: 300, tags: ['cms-data'] } }
    : {};

  try {
    const response = await fetch(url, {
      ...defaultCacheOption,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.warn(`[API ${response.status}] ${endpoint}:`, errorData);
      if (method !== 'GET') {
        return (errorData || { success: false, status: response.status, message: 'Yêu cầu không thành công' }) as any;
      }
      return null as any;
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.warn(`[API Network Error] ${endpoint}:`, error?.message || error);
    return null as any;
  }
}

/**
 * Vehicles API
 */
export const vehiclesAPI = {
  // Get all vehicles
  getAll: (params?: Record<string, any>) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI<any>(`/vehicles${query}`);
  },
  
  // Get featured vehicles
  getFeatured: () => fetchAPI('/vehicles/featured'),
  
  // Get best sellers
  getBestSellers: (params?: Record<string, any>) => fetchAPI('/vehicles/featured'),
  
  // Get vehicle by slug
  getBySlug: cache((slug: string, params?: Record<string, any>) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI<any>(`/vehicles/${slug}${query}`);
  }),
  
  // Get vehicle categories
  getCategories: () => fetchAPI('/vehicles/categories'),

  // Update layout blocks
  updateLayout: (slug: string, layoutBlocks: any[]) => fetchAPI<any>(`/vehicles/${slug}/layout`, {
    method: 'PUT',
    body: JSON.stringify({ layout_blocks: layoutBlocks }),
  }),
};

/**
 * Used Vehicles API
 */
export const usedVehiclesAPI = {
  // Get all used vehicles
  getAll: (params?: Record<string, any>) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI<any>(`/used-vehicles${query}`);
  },
  
  // Get used vehicle by slug
  getBySlug: (slug: string) => fetchAPI<any>(`/used-vehicles/${slug}`),
};

/**
 * Banners API
 */
export const bannersAPI = {
  getAll: () => fetchAPI('/vehicles/banners'),
};

/**
 * Customer Reviews API
 */
export const reviewsAPI = {
  getAll: () => fetchAPI('/vehicles/reviews'),
};

/**
 * Sales Consultants API
 */
export const consultantsAPI = {
  getAll: () => fetchAPI('/vehicles/consultants'),
  getBySlug: (slug: string) => fetchAPI(`/vehicles/consultants/${slug}`),
};

/**
 * Landing Pages API
 */
export const ldpAPI = {
  getBySalesSlug: (salesSlug: string) => fetchAPI<any>(`/ldp/${salesSlug}`, { cache: 'no-store' }),
  getBySlug: (salesSlug: string, vehicleSlug: string) => fetchAPI<any>(`/ldp/${salesSlug}/${vehicleSlug}`, { cache: 'no-store' }),
};

/**
 * Partners API
 */
export const partnersAPI = {
  getAll: () => fetchAPI('/vehicles/partners'),
};

/**
 * Products API
 */
export const productsAPI = {
  getAll: () => fetchAPI('/products'),
  getFlashSale: () => fetchAPI('/product-sale'),
};

/**
 * Accessories API
 */
export const accessoriesAPI = {
  getAll: (params?: Record<string, any>) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI<any>(`/accessories${query}`);
  },
  getBySlug: (slug: string) => fetchAPI<any>(`/accessories/${slug}`),
  getCategories: () => fetchAPI<any>('/accessories/categories'),
};

/**
 * Posts/News API (assuming there's a posts endpoint)
 */
export const postsAPI = {
  getAll: (params?: Record<string, any>) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI(`/posts${query}`);
  },
  getBySlug: (slug: string) => fetchAPI(`/posts/${slug}`),
};

/**
 * Policies API
 */
export const policiesAPI = {
  getAll: (params?: Record<string, any>) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI<any>(`/policies${query}`);
  },
  getBySlug: (slug: string, params?: Record<string, any>) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI<any>(`/policies/${slug}${query}`);
  },
};

/**
 * Services API (assuming there's a services endpoint)
 */
export const servicesAPI = {
  getAll: () => fetchAPI('/services'),
  getBySlug: cache((slug: string) => fetchAPI(`/services/${slug}`)),
};

/**
 * Jobs API (assuming there's a jobs endpoint)
 */
export const jobsAPI = {
  getAll: () => fetchAPI('/jobs'),
  getBySlug: (slug: string) => fetchAPI(`/jobs/${slug}`),
};

/**
 * Agencies API (assuming there's an agencies endpoint)
 */
export const agenciesAPI = {
  getAll: () => fetchAPI('/agencies'),
  getBySlug: (slug: string) => fetchAPI(`/agencies/${slug}`),
};

export interface SystemNotificationData {
  sys_notif_enabled: boolean;
  sys_notif_title: string;
  sys_notif_content: string;
  sys_notif_type: "info" | "success" | "warning" | "danger";
  sys_notif_display_style: "banner" | "modal" | "toast";
  sys_notif_link?: string;
  sys_notif_link_text?: string;
  sys_notif_dismissible: boolean;
}

/**
 * Settings API
 */
export const settingsAPI = {
  getInstallmentRates: () => fetchAPI<{ success: boolean; data: { rate_year_1: number; rate_subsequent: number } }>('/settings/installment'),
  getGeneral: () => fetchAPI<{
    success: boolean;
    data: {
      inject_head: string;
      inject_body_start: string;
      inject_body_end: string;
      general_company_address: string;
      general_company_phone: string;
      general_company_hotline: string;
      general_company_tax_code: string;
      general_company_working_hours: string;
      general_company_copyright: string;
      about_team_images?: any[];
    };
  }>('/settings/general'),
  getSystemNotification: () => fetchAPI<{
    success: boolean;
    data: SystemNotificationData;
  }>('/settings/system-notification'),
};

/**
 * Regions API
 */
export const regionsAPI = {
  getProvinces: () => fetchAPI<{ success: boolean; data: { id: string; name: string }[] }>('/regions/provinces'),
};

export const registrationFeesAPI = {
  getAll: () => fetchAPI<{ success: boolean; data: any[] }>('/regions/registration-fees'),
};

/**
 * Contacts API
 */
export type ContactType =
  | 'CONTACT_FORM'
  | 'ADVISE_FORM'
  | 'APPLY_FORM'
  | 'TEST_DRIVE'
  | 'TEST_DRIVE_SURVEY'
  | 'SERVICE_SURVEY'
  | 'SERVICE_BOOKING'
  | 'REPAIR_QUOTE_FORM'
  | 'NEW_CAR_QUOTE_FORM'
  | 'LDP_CLICK_CALL'
  | 'LDP_CLICK_ZALO';

export interface ContactSubmissionItem {
  type: ContactType;
  sales_consultant_id?: number;
  landing_page_id?: number | null;
  sales_email?: string | null;
  data: Record<string, any>;
}

export type ContactSubmitPayload =
  | { contact: ContactSubmissionItem }
  | ContactSubmissionItem;

export const contactsAPI = {
  submit: (
    payload: ContactSubmitPayload,
    options?: { keepalive?: boolean }
  ) => {
    const rawContact: ContactSubmissionItem =
      'contact' in payload && payload.contact
        ? payload.contact
        : (payload as ContactSubmissionItem);

    const mergedData: Record<string, any> = {
      ...(rawContact.landing_page_id !== undefined
        ? { landing_page_id: rawContact.landing_page_id }
        : {}),
      ...(rawContact.sales_email !== undefined
        ? { sales_email: rawContact.sales_email }
        : {}),
      ...(rawContact.data || {}),
    };

    const normalizedContact: ContactSubmissionItem = {
      ...rawContact,
      data: mergedData,
    };

    const isClickTracking =
      normalizedContact.type === 'LDP_CLICK_CALL' ||
      normalizedContact.type === 'LDP_CLICK_ZALO';

    return fetchAPI<{ success: boolean; data: any; message?: string }>('/contacts', {
      method: 'POST',
      keepalive: options?.keepalive ?? isClickTracking,
      body: JSON.stringify({
        ...normalizedContact,
        contact: normalizedContact,
      }),
    });
  },
};

/**
 * Maintenance API
 */
export const maintenanceAPI = {
  getSchedules: () => fetchAPI<any>('/maintenance-schedules'),
};

/**
 * Customer Handovers API (Tri ân khách hàng)
 */
export const customerHandoversAPI = {
  getAll: () => fetchAPI<{ success: boolean; data: any[] }>('/customer-handovers'),
};

/**
 * Media API for uploads
 */
export const mediaAPI = {
  upload: async (file: File): Promise<{ success: boolean; path: string; url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${getApiBaseUrl()}/upload`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      };
    }

    return response.json();
  }
};
