// src/components/admin/AdminTabGroup.jsx

import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import AdminSpaces from './AdminSpaces/AdminSpaces';
import AdminStats from './AdminStats';

export default function AdminTabGroup() {
  return (
    <Tabs variant="enclosed" mt={8}>
      <TabList>
        <Tab>Gestión Espacios</Tab>
        <Tab>Estadísticas</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <AdminSpaces />
        </TabPanel>
        <TabPanel>
          <AdminStats />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
