import { useCallback, useEffect, useState, useRef } from 'react';
import {
  Table, Thead, Tbody, Tr, Th, Td,
  Box, Heading, Button, Switch, Tag, IconButton,
  useDisclosure, useToast, AlertDialog, AlertDialogOverlay,
  AlertDialogContent, AlertDialogHeader, AlertDialogBody,
  AlertDialogFooter
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';

import { useGlobalRefresh } from "../../../context/useGlobalRefresh";
import SpaceForm from './SpaceForm';
import { getSpaces, updateSpaceStatus, deleteSpace } from '../../../services/api'; // ajusta el path si es necesario

const AdminSpaces = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState(null);
  const cancelRef = useRef();
  const { refreshToken } = useGlobalRefresh();

  const fetchSpaces = useCallback(async () => {
    try {
      const data = await getSpaces();
      setSpaces(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Error cargando espacios',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces, refreshToken]);

  const handleToggleStatus = async (space) => {
    try {
      await updateSpaceStatus(space);
      fetchSpaces();
      toast({
        title: 'Éxito',
        description: 'Estado actualizado',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Error al actualizar',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const confirmDelete = async () => {
    if (!spaceToDelete) return;

    try {
      await deleteSpace(spaceToDelete.id);
      fetchSpaces();
      toast({
        title: 'Éxito',
        description: 'Espacio eliminado',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'No se puede eliminar',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleteOpen(false);
      setSpaceToDelete(null);
    }
  };

  return (
    <Box p={6}>
      <Heading as="h1" size="xl" mb={6}>
        Administración de Espacios
      </Heading>

      <Button
        leftIcon={<AddIcon />}
        colorScheme="blue"
        mb={6}
        onClick={() => {
          setSelectedSpace(null);
          onOpen();
        }}
      >
        Nuevo Espacio
      </Button>

      <Box overflowX="auto">
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Nombre</Th>
              <Th>Capacidad</Th>
              <Th>Tipo</Th>
              <Th>Tarifa</Th>
              <Th>Estado</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {spaces.map((space) => (
              <Tr key={space.id}>
                <Td>{space.name}</Td>
                <Td>{space.capacity}</Td>
                <Td>
                  <Tag colorScheme={space.room_type === 'sala' ? 'blue' : 'green'}>
                    {space.room_type}
                  </Tag>
                </Td>
                <Td>${space.hourly_rate}/h</Td>
                <Td>
                  <Switch
                    isChecked={space.enabled}
                    onChange={() => handleToggleStatus(space)}
                    colorScheme="green"
                  />
                  {space.enabled ? 'Vigente' : 'No vigente'}
                </Td>
                <Td>
                  <IconButton
                    icon={<EditIcon />}
                    colorScheme="blue"
                    variant="ghost"
                    mr={2}
                    onClick={() => {
                      setSelectedSpace(space);
                      onOpen();
                    }}
                    aria-label="Editar espacio"
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => {
                      setSpaceToDelete(space);
                      setIsDeleteOpen(true);
                    }}
                    aria-label="Eliminar espacio"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <SpaceForm
        isOpen={isOpen}
        onClose={onClose}
        space={selectedSpace}
        onSuccess={fetchSpaces}
      />

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteOpen(false)}
        motionPreset="scale"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar Eliminación
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro que deseas eliminar este espacio? Esta acción no se puede deshacer.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default AdminSpaces;
