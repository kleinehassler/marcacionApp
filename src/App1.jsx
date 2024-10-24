import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';  // Biblioteca para leer códigos QR
import axios from 'axios';  // Para hacer peticiones HTTP

function App() {
  const [data, setData] = useState('');  // Para almacenar los datos del QR
  const [resultMessage, setResultMessage] = useState('');  // Para el mensaje de resultado
  const [loading, setLoading] = useState(false);  // Para controlar el estado de carga

  // Función para manejar el escaneo del código QR
  const handleScan = async (scannedData) => {
    if (scannedData) {
      setData(scannedData);  // Guardamos el contenido del QR
      setLoading(true);
      try {
        // Realizar la solicitud POST al backend PHP
        const response = await axios.post('http://localhost:8080/api/v1/marcations', {
          empleadoid: scannedData,  // El dato del código QR es el ID del empleado
          fec_reg: new Date().toISOString().split('T')[0],  
          user_reg: 'Nombre del usuario',  // Información adicional
          ipregistro: 'localhost',
          fecha_mark: new Date().toISOString().split('T')[0],  // Fecha actual
          hora_mark: new Date().toLocaleTimeString('es-EC'),  // Hora actual
          actividad: 1,  // Actividad (por ejemplo, 1 para entrada)
          status: 1
        });

        // Mostrar mensaje de éxito o error basado en la respuesta
        setResultMessage(response.data.message);
      } catch (error) {
        setResultMessage('Error al registrar la marcación.'.error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="App">
      <h1>Registro de Asistencia</h1>

      <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
        {/* Componente para leer el código QR */}
        <QrReader
          onResult={(result, error) => {
            if (!!result) {
              handleScan(result?.text);
            }
            if (!!error) {
              console.error(error);
            }
          }}
          style={{ width: '100%' }}
        />
      </div>

      {/* Mostrar el mensaje de carga */}
      {loading ? (
        <p>Procesando la marcación...</p>
      ) : (
        <p>{resultMessage}</p>
      )}
    </div>
  );
}

export default App;