import { useEffect, useState } from 'react';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
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
        const response = await fetch('https://localhost:4000/api/getEslogan');
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

    const fetchTitle = async () => {
      try {
        const response = await fetch('https://localhost:4000/api/getTitle', {
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

    const fetchData = () => {
      fetchEslogan();
      fetchTitle();
    };

    fetchData();

    const interval = setInterval(fetchData, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MDBContainer className='margen'>
      <section>
        <div>
          <MDBRow className="d-flex align-items-center text-center text-md-start">
            <MDBCol md="6">
            <h1 className="text-center text-md-start fs-2 fs-md-1 mb-4">{title}</h1>
            <p className="hero-description">
                {eslogan || 'Comprometidos con tu salud, brindando soluciones médicas integrales para ti y tu familia.'}
              </p>
              <div className="d-grid gap-2 d-md-flex flex-md-row flex-column">
                <button className="btn btn-primary btn-lg me-md-2">Más información</button>
                <button className="btn btn-primary btn-lg">Contactar</button>
              </div>

            </MDBCol>
            <MDBCol md="6" className="text-center">
              <img
                src="https://res.cloudinary.com/dzppbjrlm/image/upload/v1731989800/clinica_wqmjz0.jpg"
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
        <button className="btn btn-primary btn-lg btn-block">Contactar</button>
      </section>
    </MDBContainer>
  );
};
