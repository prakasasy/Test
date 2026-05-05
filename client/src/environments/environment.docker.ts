/** Used when the Angular dev server runs in Docker (`ng serve --configuration docker`). Proxies `/api` to the `api` service. */
export const environment = {
  production: false,
  apiUrl: '/api/',
  title: 'HRIS',
};
