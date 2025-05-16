// src/pages/NotFound.jsx
import { Box, Heading, Button, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Box 
      textAlign="center" 
      py={20} 
      px={6}
      minH="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bg="gray.50"
    >
      <Heading
        display="inline-block"
        as="h1"
        size="2xl"
        bgGradient="linear(to-r, teal.400, teal.600)"
        backgroundClip="text"
        mb={4}
      >
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        ¡Página no encontrada!
      </Text>
      <Text color="gray.500" mb={6}>
        La página que estás buscando no existe o fue removida
      </Text>

      <Button
        as={Link}
        to="/"
        colorScheme="teal"
        bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
        color="white"
        variant="solid"
        size="lg"
        _hover={{
          bgGradient: "linear(to-r, teal.500, teal.600, teal.700)",
          transform: "translateY(-2px)",
          boxShadow: "lg"
        }}
      >
        Volver al Inicio
      </Button>
    </Box>
  );
};

export default NotFound;