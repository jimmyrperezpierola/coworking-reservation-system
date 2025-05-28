import { Box, Heading } from '@chakra-ui/react';
import AvailabilityList from './AvailabilityList';
import styles from '../../styles/AvailabilityList.module.css';

/**
 * Panel principal de disponibilidad - Contenedor del listado
 */
export default function AvailabilityPanel() {
  return (
    <Box className={styles.panelContainer}>
      <Heading as="h2" size="lg" mb="6">Espacios Disponibles</Heading>
      <AvailabilityList />
    </Box>
  );
}