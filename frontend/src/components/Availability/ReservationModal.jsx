import { useState, useMemo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
} from '@chakra-ui/react';
import { format, addHours, differenceInMinutes } from 'date-fns';

export default function ReservationModal({ isOpen, onClose, space, onSubmit }) {
  const [startTime, setStartTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [endTime, setEndTime] = useState(format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm"));
  const toast = useToast();

  const totalCost = useMemo(() => {
    if (!space) return 0;
    const minutes = differenceInMinutes(new Date(endTime), new Date(startTime));
    const hours = Math.ceil(minutes / 60);
    return (hours * parseFloat(space.hourly_rate)).toFixed(2);
  }, [startTime, endTime, space]);

  const handleSubmit = () => {
    if (new Date(endTime) <= new Date(startTime)) {
      toast({
        title: 'Horario inválido',
        description: 'La hora final debe ser después de la hora inicial',
        status: 'error',
      });
      return;
    }

    onSubmit({
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      total_cost: parseFloat(totalCost)
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reservar {space?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb="4">Precio por hora: ${space?.hourly_rate}</Text>
          <FormControl mb="4">
            <FormLabel>Fecha y hora de inicio</FormLabel>
            <Input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </FormControl>
          <FormControl mb="4">
            <FormLabel>Fecha y hora de fin</FormLabel>
            <Input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </FormControl>
          <Text fontWeight="bold" fontSize="lg" mt="3">
            Total a pagar: ${totalCost}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Pagar Reserva
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
