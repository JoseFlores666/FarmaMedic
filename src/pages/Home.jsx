
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdb-react-ui-kit';
import './Home.css';

export const Home = () => {
  return (
    <MDBContainer fluid className="home-container">
    {/* Hero Section */}
<section className="hero-section">
  <div className="container-fluid">
    <MDBRow className="d-flex align-items-center text-center text-md-start">
      <MDBCol md="6">
        <h1 className="hero-title">FarmaMedic</h1>
        <p className="hero-description">
        Comprometidos con tu salud, brindando soluciones médicas integrales para ti y tu familia.
        </p>
        <MDBBtn color="info" size="lg" className="me-3">Más información</MDBBtn>
        <MDBBtn outline color="light" size="lg">Contactar</MDBBtn>
      </MDBCol>
      <MDBCol md="6" className="text-center">
        <img
          src="/src/assets/clinica.jpg" // Reemplaza con una imagen de alta calidad.
          alt="Médicos trabajando"
          className="img-fluid hero-image"
        />
      </MDBCol>
    </MDBRow>
  </div>
</section>


      {/* Sección de especialidades */}
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

      {/* Contacto */}
      <section className="contact-section text-center py-5">
        <h2>Contáctanos</h2>
        <p>Nos encantaría saber de ti. Llámanos o escríbenos para más información.</p>
        <MDBBtn color="info" size="lg">Contactar</MDBBtn>
      </section>
    </MDBContainer>
  );
};
