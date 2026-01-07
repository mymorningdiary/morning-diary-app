import { create } from 'zustand';

type ToastVariant = 'info' | 'success' | 'error';

type ShowToastParams = {
  message: string;
  variant?: ToastVariant;
};

type ToastState = {
  visible: boolean;
  message: string;
  variant: ToastVariant;
  show: (params: ShowToastParams) => void;
  hide: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: '',
  variant: 'info',
  show: ({ message, variant = 'info' }) => set({ visible: true, message, variant }),
  hide: () => set({ visible: false, message: '', variant: 'info' }),
}));
