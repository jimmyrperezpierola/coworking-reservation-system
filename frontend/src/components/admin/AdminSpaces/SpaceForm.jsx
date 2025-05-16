import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Switch,
  Button,
  Stack,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';

const SpaceForm = ({ isOpen, onClose, space, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    capacity: 0,
    hourly_rate: 0,
    room_type: 'sala',
    enabled: true
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (space) {
      setFormData({
        name: space.name,
        capacity: space.capacity,
        hourly_rate: space.hourly_rate,
        room_type: space.room_type,
        enabled: space.enabled
      });
    } else {
      setFormData({
        name: '',
        capacity: 0,
        hourly_rate: 0,
        room_type: 'sala',
        enabled: true
      });
    }
  }, [space, isOpen]);

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = space 
        ? `http://localhost:5000/spaces/${space.id}`
        : 'http://localhost:5000/spaces';

      const method = space ? 'put' : 'post';

      await axios[method](url, formData, getAuthHeader());
      
      onSuccess();
      onClose();
      toast({
        title: 'Éxito',
        description: space ? 'Espacio actualizado' : 'Espacio creado',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Error al guardar',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader>
          {space ? 'Editar Espacio' : 'Nuevo Espacio'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Sala de Conferencias A"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Capacidad</FormLabel>
              <NumberInput
                min={1}
                value={formData.capacity}
                onChange={(value) => setFormData({ ...formData, capacity: parseInt(value) || 0 })}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Tarifa por hora</FormLabel>
              <NumberInput
                min={0}
                step={0.5}
                value={formData.hourly_rate}
                onChange={(value) => setFormData({ ...formData, hourly_rate: parseFloat(value) || 0 })}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Tipo de espacio</FormLabel>
              <Select
                value={formData.room_type}
                onChange={(e) => setFormData({ ...formData, room_type: e.target.value })}
              >
                <option value="sala">Sala</option>
                <option value="escritorio">Escritorio</option>
              </Select>
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="enabled" mb="0">
                Habilitado
              </FormLabel>
              <Switch
                id="enabled"
                isChecked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                colorScheme="green"
              />
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            colorScheme="blue" 
            type="submit"
            isLoading={loading}
          >
            {space ? 'Guardar Cambios' : 'Crear Espacio'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SpaceForm;