import React, { useEffect } from 'react';
import database from '@react-native-firebase/database';

export default function usePresence(userId) {
  useEffect(() => {
    if (!userId) {
      console.warn("usePresence called without a userId. Presence will not be tracked.");
      return;
    }

    // Get the database reference
    const db = database();

    // Create references
    const userStatusRef = db.ref(`/status/${userId}`);
    const connectedRef = db.ref('.info/connected');

    // Handle connection state changes
    const connectionListener = connectedRef.on('value', (snapshot) => {
      if (snapshot.val() === true) {
        // Connection established (or re-established)
        
        // First set up the onDisconnect removal
        userStatusRef.onDisconnect().update({
          state: 'offline',
          last_changed: database.ServerValue.TIMESTAMP,
        }).then(() => {
          // Then update the status to online
          return userStatusRef.update({
            state: 'online',
            last_changed: database.ServerValue.TIMESTAMP,
          });
        }).catch((error) => {
          console.error('Presence update error:', error);
        });
      }
    });

    // Cleanup function
    return () => {
      // Remove the connection listener
      connectedRef.off('value', connectionListener);
      
      // Optional: Set user as offline immediately on unmount
      // Note: This might fail if connection is already lost
      userStatusRef.update({
        state: 'offline',
        last_changed: database.ServerValue.TIMESTAMP,
      }).catch(error => {
        console.log('Offline update failed (likely disconnected):', error);
      });
    };
  }, [userId]);
}