export const environment = {
  production: true,
  // Server API configuration - update for production
  apiBaseUrl: '', // Will use relative paths in production
  authEndpoint: 'api/auth',
  propertyEndpoint: '/api/properties',
  // Derived full URLs
  authApiUrl: '/auth',
  propertyApiUrl: '/api/properties',
  // Placeholder images
  placeholderImage: 'https://via.placeholder.com/400x200?text=No+Image',
  placeholderImageLarge: 'https://via.placeholder.com/800x400?text=No+Image'
};