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
import AdminSpace from '../components/admin/AdminSpace';
import AdminStats from '../components/admin/AdminStats';

export default function Dashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlTab = parseInt(searchParams.get('tab')) || 0;
  const [selectedTab, setSelectedTab] = useState(urlTab);

  // Mantiene sincronización bidireccional entre estado y URL
  useEffect(() => {
    const currentURLTab = parseInt(searchParams.get('tab')) || 0;
    if (currentURLTab !== selectedTab) {
      setSelectedTab(currentURLTab);
    }
  }, [searchParams, selectedTab]);

  const handleTabChange = (index) => {
    setSelectedTab(index);
    setSearchParams({ tab: index });
  };

  return (
    <Tabs
      index={selectedTab}
      onChange={handleTabChange}
      variant="enclosed"
    >
      <TabList>
        <Tab>Disponibilidad</Tab>
        <Tab>Mis Reservas</Tab>
        <Tab>Perfil</Tab>
        {user?.isAdmin && (
          <>
            <Tab>Gestión Espacios</Tab>
            <Tab>Estadísticas</Tab>
          </>
        )}
      </TabList>

      <TabPanels>
        <TabPanel><AvailabilityPage /></TabPanel>
        <TabPanel><MyBookings /></TabPanel>
        <TabPanel><Profile /></TabPanel>
        {user?.isAdmin && (
          <>
            <TabPanel><AdminSpace /></TabPanel>
            <TabPanel><AdminStats /></TabPanel>
          </>
        )}
      </TabPanels>
    </Tabs>
  );
}
