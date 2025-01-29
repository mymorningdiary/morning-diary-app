import { StorageKey } from '@/constants/utils';
import { StorageClient } from '@/core/storage/client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useStorageGetItem = <T>(key: string) => {
  return useQuery<T[]>({
    queryKey: [StorageKey.STORAGE, key],
    queryFn: () => StorageClient.getItem<T>(key),
  });
};

export const useStorageSaveItem = <T>(key: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [StorageKey.STORAGE, key],
    mutationFn: async (item: T) => {
      const currentItems = await StorageClient.getItem<T>(key);
      const updatedItems = [...currentItems, item];

      await StorageClient.saveItem(key, item);

      // NOTE: 데이터소스와의 동기화가 완료되기 전 UI가 최신 상태를 반영할 수 있음.
      return updatedItems;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [StorageKey.STORAGE, key] });
    },
  });
};

export const useStorageRemoveItem = <T>(key: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [StorageKey.STORAGE, key],
    mutationFn: async (item?: T) => {
      const currentItems = await StorageClient.getItem<T>(key);

      const updatedItems = currentItems.filter((existingItem) => existingItem !== item);

      await StorageClient.removeItem(key, item);

      return updatedItems;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [StorageKey.STORAGE, key] });
    },
  });
};

export const useStorageToggleItem = <T>(key: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [StorageKey.STORAGE, key],
    mutationFn: async (item: T) => {
      const currentItems = await StorageClient.getItem<T>(key);
      const updatedItems = currentItems.includes(item)
        ? currentItems.filter((existingItem) => existingItem !== item)
        : [...currentItems, item];

      if (currentItems.includes(item)) {
        await StorageClient.removeItem(key, item);
      } else {
        await StorageClient.saveItem(key, item);
      }

      return updatedItems;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [StorageKey.STORAGE, key] });
    },
  });
};
