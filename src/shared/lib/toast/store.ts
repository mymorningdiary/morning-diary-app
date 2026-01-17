import { create } from 'zustand';

type ToastType = 'info' | 'success' | 'error';

type ShowToastParams = {
  type?: ToastType;
  message: string;
};

type ToastState = {
  type: ToastType;
  visible: boolean;
  message: string;
  show: (params: ShowToastParams) => void;
  hide: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
  type: 'info',
  visible: false,
  message: '',
  show: ({ type = 'info', message }) => set({ type, visible: true, message }),
  hide: () => set({ type: 'info', visible: false, message: '' }),
}));
