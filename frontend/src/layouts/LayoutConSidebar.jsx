// src/layouts/LayoutConSidebar.jsx
import { Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function LayoutConSidebar() {
  return (
    <Flex minH="100vh">
      <Sidebar />
      <Flex flex="1" p={4} direction="column">
        <Outlet />
      </Flex>
    </Flex>
  );
}
