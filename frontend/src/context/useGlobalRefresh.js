// context/useGlobalRefresh.js
import { useContext } from 'react';
import { GlobalRefreshContext } from './GlobalRefreshContext';

export const useGlobalRefresh = () => useContext(GlobalRefreshContext);
