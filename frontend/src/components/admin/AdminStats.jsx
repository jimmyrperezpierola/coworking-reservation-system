import { Box, Text, SimpleGrid, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Datos de ejemplo para las gráficas (reemplaza con datos reales de tu API)
const sampleData = [
  { name: 'Lun', ocupación: 70 },
  { name: 'Mar', ocupación: 45 },
  { name: 'Mié', ocupación: 80 },
  { name: 'Jue', ocupación: 65 },
  { name: 'Vie', ocupación: 90 },
];

/**
 * Panel de estadísticas para administradores
 * Muestra métricas clave y gráficos de ocupación
 */
export default function AdminStats() {
  return (
    <Box p="4">
      {/* Título */}
      <Text fontSize="2xl" fontWeight="bold" mb="6">
        Estadísticas de Ocupación
      </Text>

      {/* Métricas rápidas */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing="4" mb="8">
        <Stat p="4" bg="white" borderRadius="lg" boxShadow="sm">
          <StatLabel>Ocupación Hoy</StatLabel>
          <StatNumber>68%</StatNumber>
        </Stat>
        <Stat p="4" bg="white" borderRadius="lg" boxShadow="sm">
          <StatLabel>Reservas Totales</StatLabel>
          <StatNumber>124</StatNumber>
        </Stat>
        <Stat p="4" bg="white" borderRadius="lg" boxShadow="sm">
          <StatLabel>Ingresos Mensuales</StatLabel>
          <StatNumber>$5,280</StatNumber>
        </Stat>
      </SimpleGrid>

      {/* Gráfico de ocupación semanal */}
      <Box bg="white" p="4" borderRadius="lg" boxShadow="sm" h="300px">
        <Text fontWeight="bold" mb="4">
          Ocupación Semanal
        </Text>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={sampleData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="ocupación" fill="#3182CE" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}