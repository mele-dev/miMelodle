import { CanActivateFn } from '@angular/router';
import axios from 'axios';

export const includeBackendAuthInterceptorGuard: CanActivateFn = (route, state) => {
    // If the user is already logged in, their token should be injected into
    // every request to the backend.
    axios.interceptors.request.use((config) => {
        // Authorization may be overriden by setting it to anything other than
        // undefined.
        if (config.headers.Authorization === undefined) {
            config.headers.Authorization = "Bearer " + userInfo?.jwtToken;
        }
        return config;
    });

    return true;
};
