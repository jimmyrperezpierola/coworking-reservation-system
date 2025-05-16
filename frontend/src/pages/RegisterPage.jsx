import { useState } from 'react';
import { register } from "../services/api";
import {
  Box, Input, Button, FormControl, FormLabel, useToast,
  Heading, Text, Link, Flex
} from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null; // Evita mostrar el registro si ya estás autenticado
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email no válido';
    }
    
    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Cambia esta línea: pasa email y password directamente, no como objeto
      await register(email, password);
      
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Redirige al login después del registro exitoso
      navigate('/login', { replace: true });

    } catch (error) {
      // Manejo mejorado de errores
      let errorMessage = 'Error al registrar usuario';
      
      if (error.message.includes('El email ya está registrado') || 
          error.message.includes('already registered')) {
        errorMessage = 'Este email ya está registrado';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error en el registro",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      
      // Opcional: Limpiar campos en caso de error
      if (errorMessage.includes('email')) {
        setEmail('');
      }
      setPassword('');
      setConfirmPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth="1px" borderRadius="lg">
      <Heading as="h1" size="lg" textAlign="center" mb={6}>
        Crear cuenta
      </Heading>
      
      <form onSubmit={handleSubmit}>
        <FormControl isInvalid={!!errors.email} isRequired>
          <FormLabel>Email</FormLabel>
          <Input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@email.com"
            autoFocus
          />
          {errors.email && <Text color="red.500" fontSize="sm">{errors.email}</Text>}
        </FormControl>
        
        <FormControl isInvalid={!!errors.password} isRequired mt={4}>
          <FormLabel>Contraseña</FormLabel>
          <Input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          {errors.password && <Text color="red.500" fontSize="sm">{errors.password}</Text>}
        </FormControl>
        
        <FormControl isInvalid={!!errors.confirmPassword} isRequired mt={4}>
          <FormLabel>Confirmar Contraseña</FormLabel>
          <Input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <Text color="red.500" fontSize="sm">{errors.confirmPassword}</Text>
          )}
        </FormControl>
        
        <Button 
          type="submit" 
          colorScheme="blue" 
          mt={6} 
          w="full"
          isLoading={isLoading}
          loadingText="Registrando..."
          isDisabled={!email || !password || !confirmPassword}
        >
          Registrarse
        </Button>
      </form>
      
      <Flex mt={4} justifyContent="center">
        <Text mr={2}>¿Ya tienes cuenta?</Text>
        <Link color="blue.500" href="/login" fontWeight="medium">
          Inicia sesión
        </Link>
      </Flex>
    </Box>
  );
}