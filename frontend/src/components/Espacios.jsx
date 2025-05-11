import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent, CardMedia, Typography } from '@mui/material';

// Corrige el path del archivo JSON
import spaces from '../assets/espacios.json';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center',
        padding: '20px',
    },
    card: {
        flex: '1 1 calc(33.333% - 20px)', // 3 por fila con espacio entre ellos
        boxSizing: 'border-box',
        borderRadius: '8px',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
    },
    media: {
        height: 140, // Altura fija para la imagen
        width: '100%', // Asegura que la imagen ocupe todo el ancho del contenedor
        objectFit: 'contain', // Cambiado a 'contain' para evitar recortes
        marginTop: '10px', // Agrega un margen superior
        borderRadius: '8px 8px 0 0', // Redondea las esquinas superiores
        backgroundColor: '#f0f0f0', // Fondo para imágenes con transparencia
    },
};

export default function GetEspacios() {
    const espacios = spaces || [];
    return (
        <div style={styles.container}>
            {espacios.length > 0 ? (
                espacios.map((espacio) => (
                    <Card key={espacio.id} style={styles.card}>
                        <CardMedia
                            style={{ ...styles.media, marginTop: '10px', objectFit: 'contain', width: '180px', height: '180px', paddingLeft: '80px' }}
                            image={
                                espacio.type === 'desktop'
                                    ? '/src/assets/desktop.png' // Ruta de la imagen para 'desktop'
                                    : '/src/assets/meetingroom.png' // Ruta de la imagen para 'meeting room'
                            }
                            title={espacio.type}
                        />
                        <CardContent>
                            <Typography variant="h6" component="div">
                                {espacio.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {espacio.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Capacidad: {espacio.capacity}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Precio: ${espacio.price} por hora
                            </Typography>
                        </CardContent>
                        <Button
                            variant="contained"
                            component={Link}
                            to="/reservas"
                            sx={{ m: 2 }}
                        >
                            Seleccionar
                        </Button>
                    </Card>
                ))
            ) : (
                <Typography variant="body1">No hay espacios disponibles</Typography>
            )}
        </div>
    );
}