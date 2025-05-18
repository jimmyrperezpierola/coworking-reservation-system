import { useEffect, useState } from 'react';
import { SimpleGrid, Box, Button, Text, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';

export default function AvailabilityList() {
  const { token } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/spaces', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setSpaces(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching spaces:', err);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <Spinner size="xl" />;

  return (
    <SimpleGrid columns={[1, 2, 3]} spacing="4">
      {spaces.map(space => (
        <Box key={space.id} p="4" borderWidth="1px" borderRadius="lg">
          <Text fontWeight="bold">{space.name}</Text>
          <Text>Capacidad: {space.capacity}</Text>
          <Button colorScheme="blue" mt="2" size="sm">
            Reservar
          </Button>
        </Box>
      ))}
    </SimpleGrid>
  );
}