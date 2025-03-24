import { showError } from '@/features/error/errorSlice';
import { Middleware } from 'redux';

export const errorMiddleware: Middleware = (storeAPI) => (next) => (action: any) => {
  if (action.error) {
    storeAPI.dispatch(showError(action.payload.data.message.toString()));
    // toast.error(action.payload.data.message.toString());
  }
  return next(action);
};
