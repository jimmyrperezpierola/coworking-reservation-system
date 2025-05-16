// src/pages/AvailabilityPage.jsx
import { Box } from '@chakra-ui/react';
import AvailabilityPanel from '../components/Availability/AvailabilityPanel';

/**
 * Página completa de disponibilidad que envuelve el panel principal
 * Incluye todos los elementos de layout (header, padding, etc.)
 */
export default function AvailabilityPage() {
  return (
    <Box p={{ base: 4, md: 8 }} maxW="1400px" mx="auto">
      {/* Puedes agregar aquí un header específico para la página si lo necesitas */}
      <AvailabilityPanel />
    </Box>
  );
}