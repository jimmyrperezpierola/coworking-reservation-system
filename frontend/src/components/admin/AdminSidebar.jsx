import { Box, VStack, Button } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

export default function AdminSidebar() {
  return (
    <Box w="250px" bg="gray.900" color="white" p="4">
      <VStack align="stretch">
        <Button as={NavLink} to="/admin/spaces" variant="ghost">
          Gestión de Espacios
        </Button>
        <Button as={NavLink} to="/admin/stats" variant="ghost">
          Estadísticas
        </Button>
      </VStack>
    </Box>
  );
}