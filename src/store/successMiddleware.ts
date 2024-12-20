import { showSuccess } from '@/features/success/successSlice';
import { Middleware } from 'redux';

export const successMiddleware: Middleware =
  (storeAPI) => (next) => (action) => {
    if (action && action?.type == 'api/executeMutation/fulfilled') {
      storeAPI.dispatch(showSuccess(action));
    }
    return next(action);
  };
