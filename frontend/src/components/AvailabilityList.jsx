import { useEffect, useState } from 'react';
import { SimpleGrid, Box, Button, Text, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';
import { useGlobalRefresh } from '../../context/useGlobalRefresh';

export default function AvailabilityList() {
  const { token } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshToken, triggerGlobalRefresh } = useGlobalRefresh();


  const fetchSpaces = async () => {

  try {
    const res = await axios.get('http://localhost:5000/spaces/enabled', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSpaces(res.data);
  } catch (err) {
    console.error('Error fetching spaces:', err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
   setLoading(true);
  fetchSpaces();
}, [token, refreshToken, triggerGlobalRefresh]);


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