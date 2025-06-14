import { useState } from 'react';
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
  RadioGroup,
  Radio,
  Stack,
} from '@chakra-ui/react';
import { format, addHours } from 'date-fns';

export default function ReservationModal({ isOpen, onClose, space, onSubmit }) {
  const [startTime, setStartTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [endTime, setEndTime] = useState(format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm"));
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const toast = useToast();

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
      payment_method: paymentMethod,
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
          <FormControl as="fieldset" mb="4">
            <FormLabel as="legend">Método de Pago</FormLabel>
            <RadioGroup
              value={paymentMethod}
              onChange={setPaymentMethod}
            >
              <Stack direction="row">
                <Radio value="Efectivo">Efectivo</Radio>
                <Radio value="QR">QR</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Confirmar Reserva
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
