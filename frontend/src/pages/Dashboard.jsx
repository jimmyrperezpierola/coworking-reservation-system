import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import AvailabilityPage from '../pages/AvailabilityPage';
import MyBookings from '../components/MyBookings';
import Profile from "../pages/Profile";
import AdminSpaces from '../components/admin/AdminSpaces/AdminSpaces';
import AdminStats from '../components/admin/AdminStats';
import { useGlobalRefresh } from '../context/useGlobalRefresh';

export default function Dashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlTab = parseInt(searchParams.get('tab')) || 0;
  const [selectedTab, setSelectedTab] = useState(urlTab);
const { triggerGlobalRefresh } = useGlobalRefresh();

  useEffect(() => {
    const currentURLTab = parseInt(searchParams.get('tab')) || 0;
    if (currentURLTab !== selectedTab) {
      setSelectedTab(currentURLTab);
    }
  }, [searchParams, selectedTab]);

  const handleTabChange = (index) => {
    setSelectedTab(index);
    setSearchParams({ tab: index });
    triggerGlobalRefresh();
  };

  // ⚠️ Pestañas base
  const tabs = [
    { label: 'Disponibilidad', component: <AvailabilityPage /> },
    { label: 'Mis Reservas', component: <MyBookings /> },
    { label: 'Perfil', component: <Profile /> },
  ];

  // 🧠 Agregar pestañas admin si aplica
  if (user?.isAdmin) {
    tabs.push(
      { label: 'Gestión Espacios', component: <AdminSpaces /> },
      { label: 'Estadísticas', component: <AdminStats /> }
    );
  }

  return (
    <Tabs
      index={selectedTab}
      onChange={handleTabChange}
      variant="enclosed"
    >
      <TabList>
        {tabs.map((tab, index) => (
          <Tab key={index}>{tab.label}</Tab>
        ))}
      </TabList>

      <TabPanels>
        {tabs.map((tab, index) => (
          <TabPanel key={index}>{tab.component}</TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}


