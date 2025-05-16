import { Flex } from '@chakra-ui/react';
//import { Box, Text } from '@chakra-ui/react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Outlet } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <Flex minH="100vh">
      <AdminSidebar />
      <Flex flex="1" p="4">
        <Outlet /> {/* Renderiza AdminSpaces o AdminStats aquí */}
      </Flex>
    </Flex>
  );
}