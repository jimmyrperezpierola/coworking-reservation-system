import { useEffect, useState } from 'react';
import {
  Box,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Spinner,
} from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getAdminStats } from '../../services/api'; // Ajusta el path si es necesario

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Error al cargar estadísticas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <Box p="4">
      <Text fontSize="2xl" fontWeight="bold" mb="6">
        Estadísticas de Ocupación
      </Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing="4" mb="8">
        <Stat p="4" bg="white" borderRadius="lg" boxShadow="sm">
          <StatLabel>Ocupación Hoy</StatLabel>
          <StatNumber>{stats?.todayOccupancy ?? '-'}</StatNumber>
        </Stat>
        <Stat p="4" bg="white" borderRadius="lg" boxShadow="sm">
          <StatLabel>Reservas Totales</StatLabel>
          <StatNumber>{stats?.totalBookings ?? '-'}</StatNumber>
        </Stat>
        <Stat p="4" bg="white" borderRadius="lg" boxShadow="sm">
          <StatLabel>Ingresos Mensuales</StatLabel>
          <StatNumber>${stats?.monthlyRevenue?.toFixed(2) ?? '0.00'}</StatNumber>
        </Stat>
      </SimpleGrid>

      <Box bg="white" p="4" borderRadius="lg" boxShadow="sm" h="300px">
        <Text fontWeight="bold" mb="4">
          Ocupación Semanal
        </Text>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={stats.weeklyOccupancy}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3182CE" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
