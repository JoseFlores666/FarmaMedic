import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types'; // Importa PropTypes

const VistaPolitica = ({ showModal, onClose }) => {
  const [deslindes, setDeslindes] = useState([]);
  Modal.setAppElement('#root');

  useEffect(() => {
    const fetchDeslindes = async () => {
      try {
        const response = await fetch('https://back-farmam.onrender.com/api/getCurrentPolitica');
        const data = await response.json();
        setDeslindes(data);
      } catch (error) {
        console.error('Error al obtener los deslindes:', error);
      }
    };
    fetchDeslindes();
  }, []);

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <Modal
      isOpen={showModal}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          maxWidth: '600px',
          width: '90%',
          borderRadius: '1rem',
          padding: '20px',
        },
      }}
    >
      <div className="text-center mb-4">
        <h2 className='text-black'>Politicas de Privacidad Vigente</h2>
      </div>
      <div className="container">
        {deslindes.map((item) => (
          <div className="card mb-4" style={{ borderRadius: '1rem', border: '1px solid' }} key={item.id}>
            <div className="card-header d-flex justify-content-between align-items-center" style={{ borderRadius: '1rem', borderBottom: '1px solid' }}>
              <div className="d-flex align-items-center">
                <strong className="me-2">Título:</strong>
                <span>{item.titulo}</span>
              </div>
              <button className='btn btn-danger btn-sm' onClick={onClose}>Cerrar</button>
            </div>

            <div className="card-body text-center"> 
              <label>Contenido: </label>
              <p className="form-control-plaintext">{item.contenido}</p>
              <div className="row mt-4">
                <div className="col-md-4">
                  <label>Versión</label>
                  <p className="form-control-plaintext">{item.version}.0</p>
                </div>
                <div className="col-md-4">
                  <label>Vigencia</label>
                  <p className="form-control-plaintext">{item.vigencia}</p>
                </div>
                <div className="col-md-4">
                  <label>Estado</label>
                  <p className="form-control-plaintext">{item.estado}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label>Fecha de Creación</label>
                  <p className="form-control-plaintext">{formatDate(item.fecha_creacion)}</p>
                </div>
                <div className="col-md-6">
                  <label>Fecha de Vigencia</label>
                  <p className="form-control-plaintext">{formatDate(item.fecha_vigencia)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

VistaPolitica.propTypes = {
  showModal: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default VistaPolitica;
