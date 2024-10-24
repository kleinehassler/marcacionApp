import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';

function App() {
  const [data, setData] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isScanningAllowed, setIsScanningAllowed] = useState(true); // Nueva variable para controlar el escaneo

  // Función para manejar el escaneo del código QR
  const handleScan = async (scannedData) => {
    if (scannedData && isScanningAllowed) {
      setIsScanningAllowed(false); // Bloquear escaneo hasta que termine el proceso
      setData(scannedData);
      setLoading(true);

      try {
        const response = await axios.post('http://localhost:8080/api/v1/marcations', {
          empleadoid: scannedData,
          fec_reg: new Date().toISOString().split('T')[0],
          user_reg: 'Nombre del usuario',
          ipregistro: 'localhost',
          fecha_mark: new Date().toISOString().split('T')[0],
          hora_mark: new Date().toLocaleTimeString('es-EC'),
          actividad: 1,
          status: 1,
        });

        setResultMessage(response.data.message);
      } catch (error) {
        setResultMessage('Error al registrar la marcación.');
      } finally {
        setLoading(false);
        // Permitir nuevo escaneo después de 3 segundos (o el tiempo que desees)
        setTimeout(() => setIsScanningAllowed(true), 3000);
      }
    }
  };

  return (
    <div className="App">
      <h1>Registro de Asistencia</h1>

      <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
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

      {loading ? (
        <p>Procesando la marcación...</p>
      ) : (
        <p>{resultMessage}</p>
      )}
    </div>
  );
}

export default App;
