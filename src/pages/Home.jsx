import { useEffect, useState } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdb-react-ui-kit';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './Home.css';

const MySwal = withReactContent(Swal);

export const Home = () => {
  const [eslogan, setEslogan] = useState(''); 
  const [title, setTitle] = useState('');

  useEffect(() => {
    const fetchEslogan = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/getEslogan'); 
        if (!response.ok) {
          throw new Error('Error al obtener el eslogan');
        }
        const data = await response.json();
        setEslogan(data.eslogan || ''); 
      } catch (error) {
        console.error('Error al obtener el eslogan:', error);
        MySwal.fire('Error', 'No se pudo obtener el eslogan', 'error');
      }
    };

    fetchEslogan(); 
    fetchTitle();
  }, []);

  const fetchTitle = async () => {
    try {
        const response = await fetch('http://localhost:4000/api/getTitle', {
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Error al obtener el título');
        }
        const data = await response.json();
        setTitle(data[0]?.title || ''); 
    } catch (error) {
        console.error('Error al obtener el título:', error);
        MySwal.fire('Error', 'No se pudo obtener el título', 'error');
    }
};

  return (
    <MDBContainer fluid className="home-container">
      <section className="hero-section">
        <div className="container-fluid">
          <MDBRow className="d-flex align-items-center text-center text-md-start">
            <MDBCol md="6">
              <h1 className="hero-title">{title}</h1>
              <p className="hero-description">
                {eslogan || 'Comprometidos con tu salud, brindando soluciones médicas integrales para ti y tu familia.'}
              </p>
              <MDBBtn color="info" size="lg" className="me-3">Más información</MDBBtn>
              <MDBBtn outline color="light" size="lg">Contactar</MDBBtn>
            </MDBCol>
            <MDBCol md="6" className="text-center">
              <img
                src="/src/assets/clinica.jpg" 
                alt="Médicos trabajando"
                className="img-fluid hero-image"
              />
            </MDBCol>
          </MDBRow>
        </div>
      </section>

      <section className="specialties-section py-5">
        <h2 className="text-center mb-4">Nuestras Especialidades</h2>
        <MDBRow className="d-flex justify-content-center">
          <MDBCol md="3" className="mb-4">
            <div className="specialty-card">
              <h3>Medicina Interna</h3>
              <p>Especialistas en el tratamiento integral de enfermedades adultas.</p>
            </div>
          </MDBCol>
          <MDBCol md="3" className="mb-4">
            <div className="specialty-card">
              <h3>Pediatría</h3>
              <p>Cuidado especializado para niños y adolescentes.</p>
            </div>
          </MDBCol>
          <MDBCol md="3" className="mb-4">
            <div className="specialty-card">
              <h3>Cardiología</h3>
              <p>Detección y tratamiento de enfermedades cardiovasculares.</p>
            </div>
          </MDBCol>
        </MDBRow>
      </section>

      <section className="contact-section text-center py-5">
        <h2>Contáctanos</h2>
        <p>Nos encantaría saber de ti. Llámanos o escríbenos para más información.</p>
        <MDBBtn color="info" size="lg">Contactar</MDBBtn>
      </section>
    </MDBContainer>
  );
};
