import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  List,
  ListItem,
  Spinner,
  Input
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { getSpaceAvailability } from '../../services/api';

export default function AvailabilityModal({ isOpen, onClose, space }) {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() =>
    format(new Date(), 'yyyy-MM-dd')
  );

  useEffect(() => {
    if (!space || !selectedDate) return;
    setLoading(true);

    getSpaceAvailability(space.id, selectedDate)
      .then(data => setAvailability(data.slots || data)) // Compatible con ambas respuestas
      .catch(() => setAvailability([]))
      .finally(() => setLoading(false));
  }, [space, selectedDate]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Disponibilidad de {space?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={2}>Selecciona una fecha:</Text>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            mb={4}
          />

          {loading ? (
            <Spinner />
          ) : availability.length > 0 ? (
            <List spacing={3}>
              {availability.map((slot, i) => (
                <ListItem key={i}>
                  {format(new Date(slot.start), "PPPp")} → {format(new Date(slot.end), "PPPp")}
                </ListItem>
              ))}
            </List>
          ) : (
            <Text>No hay disponibilidad programada</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
