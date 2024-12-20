import { showError } from '@/features/error/errorSlice';
import { Middleware } from 'redux';
import { toast } from 'sonner';

export const errorMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  if (action.error) {
    storeAPI.dispatch(showError(action.payload.data.message.toString()));
    toast.error(action.payload.data.message.toString());
  }
  return next(action);
};
