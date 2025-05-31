import { useState } from 'react';
import { login } from "../services/api";
import {
  Box, Input, Button, FormControl, FormLabel, useToast
} from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { login: authLogin, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null; // Evita mostrar el login si ya estás autenticado
  }

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await login(email, password);

    // 👉 Espera 50ms para asegurar que axios tenga el header
    setTimeout(() => {
      authLogin({
        user: response.user,
        token: response.token,
      });

      toast({
        title: "¡Bienvenido!",
        description: `Hola ${response.user.name || response.user.email}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate('/dashboard', { replace: true });
    }, 50); // Delay mínimo, pero efectivo
  } catch (error) {
    toast({
      title: "Error al iniciar sesión",
      description: error.response?.data?.message || 'Credenciales incorrectas',
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth="1px" borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@email.com"
            autoFocus
          />
        </FormControl>
        
        <FormControl isRequired mt={4}>
          <FormLabel>Contraseña</FormLabel>
          <Input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </FormControl>
        
        <Button 
          type="submit" 
          colorScheme="blue" 
          mt={4} 
          w="full"
          isLoading={isLoading}
          loadingText="Iniciando sesión..."
          isDisabled={!email || !password}
        >
          Iniciar sesión
        </Button>
      </form>
    </Box>
  );
}
