import { useCallback } from 'react';
import Share, { ShareOptions } from 'react-native-share';

const useAppShare = () => {
  const shareContent = useCallback(
    async (message: string, options?: ShareOptions) => {
      try {
        await Share.open({ message, ...options });
      } catch (error) {
        console.error('Error sharing content:', error);
      }
    },
    [],
  );

  return { shareContent };
};

export default useAppShare;
