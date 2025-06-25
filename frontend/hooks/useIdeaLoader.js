import { useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useIdeas } from '../context/IdeaContext';

export const useIdeaLoader = () => {
  const { isAuthenticated } = useUser();
  const { loadIdeas, clearIdeas } = useIdeas();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔄 Loading ideas - user authenticated');
      loadIdeas();
    } else {
      console.log('🧹 Clearing ideas - user not authenticated');
      clearIdeas();
    }
  }, [isAuthenticated]);
}; 