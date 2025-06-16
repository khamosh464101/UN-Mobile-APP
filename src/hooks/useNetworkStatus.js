import { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState(null);

  useEffect(() => {
    // Initial check
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  return {
    isConnected,
    connectionType,
    isWifi: connectionType === "wifi",
    isCellular: connectionType === "cellular",
    isOffline: !isConnected,
  };
};

export default useNetworkStatus;
