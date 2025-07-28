/**
 * User Type Management Service
 * Handles user type checking and management throughout the application
 */

/**
 * Get the current user type from localStorage
 * @returns {string} 'admin' or 'regular'
 */
export const getUserType = () => {
  return localStorage.getItem('userType') || 'regular';
};

/**
 * Check if the current user is an admin
 * @returns {boolean} true if user is admin, false otherwise
 */
export const isAdmin = () => {
  return getUserType() === 'admin';
};

/**
 * Check if the current user is a regular user
 * @returns {boolean} true if user is regular, false otherwise
 */
export const isRegularUser = () => {
  return getUserType() === 'regular';
};

/**
 * Get the appropriate dashboard route based on user type
 * @returns {string} The dashboard route for the current user type
 */
export const getDashboardRoute = () => {
  const userType = getUserType();
  return userType === 'admin' ? '/admin/dashboard' : '/user/overview';
};

/**
 * Check if a route is accessible by the current user type
 * @param {string} route - The route to check
 * @returns {boolean} true if accessible, false otherwise
 */
export const canAccessRoute = (route) => {
  const userType = getUserType();
  
  // Admin can access all routes
  if (userType === 'admin') {
    return true;
  }
  
  // Regular users can only access user routes and some specific routes
  const regularUserAccessibleRoutes = [
    '/user/overview',
    '/user/rewards',
    '/user/status',
    '/user/faqs',
    '/user/criteria',
    '/user/form',
    '/user/view',
    '/user/edit',
    '/user/sucess',
    '/user/config',
    '/home/overview',
    '/home/newcal',
    '/home/previousresults',
    '/home/imports',
    '/home/config',
    '/home/alloc',
    '/home/dataversions',
    '/home/create',
    '/resource/new',
    '/resource/inprogress',
    '/resource/awaiting',
    '/resource/reopened',
    '/resource/completed',
    '/resource/canceled',
    '/resource/info'
  ];
  
  return regularUserAccessibleRoutes.includes(route);
};

/**
 * Clear user type information from localStorage
 */
export const clearUserType = () => {
  localStorage.removeItem('userType');
  localStorage.removeItem('isStaff');
  localStorage.removeItem('isSuperuser');
};

/**
 * Set user type information in localStorage
 * @param {Object} userData - User data containing type information
 */
export const setUserType = (userData) => {
  if (userData && userData.user_type) {
    localStorage.setItem('userType', userData.user_type);
    localStorage.setItem('isStaff', userData.is_staff);
    localStorage.setItem('isSuperuser', userData.is_superuser);
  }
}; 