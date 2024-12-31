import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { retryProfileCreation } from '../lib/supabase';

const App: React.FC = () => {
  useEffect(() => {
    const checkProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!profile) {
          // Try to create profile if it doesn't exist
          await retryProfileCreation(
            session.user.id,
            session.user.user_metadata.username,
            session.user.email!
          );
        }
      }
    };

    checkProfile();
  }, []);

  return (
    // Rest of the component code
  );
};

export default App; 