/**
 * API utility for fetching data from Laravel backend
 * Base URL should be configured via environment variable
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Vehicles API
 */
export const vehiclesAPI = {
  // Get all vehicles
  getAll: () => fetchAPI('/vehicles'),
  
  // Get featured vehicles
  getFeatured: () => fetchAPI('/vehicles/featured'),
  
  // Get vehicle by slug
  getBySlug: (slug: string) => fetchAPI(`/vehicles/${slug}`),
  
  // Get vehicle categories
  getCategories: () => fetchAPI('/vehicles/categories'),
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
 * Posts/News API (assuming there's a posts endpoint)
 */
export const postsAPI = {
  getAll: () => fetchAPI('/posts'),
  getBySlug: (slug: string) => fetchAPI(`/posts/${slug}`),
};

/**
 * Services API (assuming there's a services endpoint)
 */
export const servicesAPI = {
  getAll: () => fetchAPI('/services'),
  getBySlug: (slug: string) => fetchAPI(`/services/${slug}`),
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

/**
 * Contacts API
 */
export const contactsAPI = {
  submit: (payload: {
    contact: {
      type: 'CONTACT_FORM' | 'ADVISE_FORM';
      data: Record<string, any>;
    };
  }) => fetchAPI<{ success: boolean; data: any; message?: string }>('/contacts', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
};
