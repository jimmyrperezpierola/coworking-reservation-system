import { useEffect, useState } from 'react';
import { SimpleGrid, Box, Button, Text, Spinner } from '@chakra-ui/react';
import { useAuth } from '../context/useAuth';
import { useGlobalRefresh } from '../../context/useGlobalRefresh';
import { getEnabledSpaces } from '../../api'; // Ajusta el path según tu estructura

export default function AvailabilityList() {
  const { token } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshToken, triggerGlobalRefresh } = useGlobalRefresh();

  useEffect(() => {
    const fetchSpaces = async () => {
      setLoading(true);
      try {
        const data = await getEnabledSpaces(token);
        setSpaces(data);
      } catch (err) {
        console.error('Error fetching spaces:', err);
      } finally {
        setLoading(false);
      }
    };

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
