import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';

function App() {
  const [data, setData] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isScanningAllowed, setIsScanningAllowed] = useState(true);
  const [showModal, setShowModal] = useState(false); // Para mostrar el modal

  // Función para manejar el escaneo del código QR
  const handleScan = async (scannedData) => {
    if (scannedData && isScanningAllowed) {
      setIsScanningAllowed(false); // Bloquear nuevo escaneo
      setData(scannedData);
      setLoading(true);

      try {
        const response = await axios.post('https://marcacion-api.onrender.com/api/v1/registros', {
          codigoqr: scannedData
        });

        setResultMessage(response.data.message || 'Marcación registrada correctamente');
        setShowModal(true); // Mostrar el modal con el mensaje
      } catch (error) {
        setResultMessage('Error al registrar la marcación.');
        setShowModal(true); // Mostrar el modal con el mensaje de error
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para cerrar el modal y permitir un nuevo escaneo
  const handleCloseModal = () => {
    setShowModal(false);
    setIsScanningAllowed(true); // Permitir nuevo escaneo después de que el usuario cierre el modal
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

      {loading ? (
        <p>Procesando la marcación...</p>
      ) : (
        <>
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>{resultMessage}</h2>
                <button onClick={handleCloseModal}>Aceptar</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
