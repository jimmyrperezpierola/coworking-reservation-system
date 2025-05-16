import { Box, VStack, Button, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <Box 
      w="250px" 
      bg="gray.800"
      color="white"
      p="4"
      minH="100vh"
    >
      <VStack align="stretch" spacing="4">
        <Text fontSize="lg" fontWeight="bold" mb="4" color="white">
          {user?.email || "Usuario"}
        </Text>

        <Button
          as={Link}
          to="/dashboard?tab=0"
          variant="ghost"
          color="white"
          _hover={{ bg: 'gray.700' }}
          justifyContent="flex-start"
        >
          Disponibilidad
        </Button>

        <Button
          as={Link}
          to="/dashboard?tab=1"
          variant="ghost"
          color="white"
          _hover={{ bg: 'gray.700' }}
          justifyContent="flex-start"
        >
          Mis Reservas
        </Button>

        <Button
          as={Link}
          to="/dashboard?tab=2"
          variant="ghost"
          color="white"
          _hover={{ bg: 'gray.700' }}
          justifyContent="flex-start"
        >
          Perfil
        </Button>

        {user?.isAdmin && (
          <>
            <Text mt="4" color="gray.300" fontSize="sm">ADMINISTRACIÓN</Text>
            <Button
              as={Link}
              to="/dashboard?tab=3"
              variant="ghost"
              color="white"
              _hover={{ bg: 'gray.700' }}
              justifyContent="flex-start"
            >
              Gestión Espacios
            </Button>
            <Button
              as={Link}
              to="/dashboard?tab=4"
              variant="ghost"
              color="white"
              _hover={{ bg: 'gray.700' }}
              justifyContent="flex-start"
            >
              Estadísticas
            </Button>
          </>
        )}

        <Button mt="8" colorScheme="red" onClick={logout}>
          Cerrar sesión
        </Button>
      </VStack>
    </Box>
  );
}
