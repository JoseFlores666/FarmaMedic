import { useEffect, useState } from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { fetchEnlaces } from '../../../Api/apiEnlaces';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const MySwal = withReactContent(Swal);

const Footer = () => {
  const [enlaces, setEnlaces] = useState([]);
  const [contactInfo, setContactInfo] = useState({ direccion: '', email: '', telefono: '' });

  const loadEnlaces = async () => {
    try {
      const data = await fetchEnlaces();
      setEnlaces(data);
    } catch (error) {
      console.error('Error al obtener enlaces en Footer:', error);
      MySwal.fire('Error', 'Error al obtener enlaces', 'error');
    }
  };

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('https://localhost:4000/api/getContactInfo');
      if (!response.ok) {
        throw new Error('No se pudo obtener la información de contacto');
      }
      const data = await response.json();
      if (data) {
        setContactInfo({
          direccion: data.direccion,
          email: data.email,
          telefono: data.telefono,
        });
      }
    } catch (error) {
      console.error('Error al obtener datos de contacto:', error);
      MySwal.fire('Error', 'Error al obtener los datos de contacto', 'error');
    }
  };

  useEffect(() => {
    loadEnlaces();
    fetchContactInfo();

    const intervalId = setInterval(() => {
      loadEnlaces();
      fetchContactInfo();
    }, 20000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <footer className="text-center text-lg-start text-white" style={{ backgroundColor: '#1c2331' }}>
      <section className="d-flex justify-content-between p-4">
        <div className="container text-center text-md-start mt-5">
          <div className="row mt-3">

            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold">Company name</h6>
              <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
              <p>
                Aquí puedes usar filas y columnas para organizar el contenido de tu pie de página. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              </p>
            </div>

            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold">Productos</h6>
              <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
              <p><a href="#!" className="text-white">MDBootstrap</a></p>
              <p><a href="#!" className="text-white">MDWordPress</a></p>
              <p><a href="#!" className="text-white">BrandFlow</a></p>
              <p><a href="#!" className="text-white">Bootstrap Angular</a></p>
            </div>

            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold">Encuentranos</h6>
              <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
              <p className="text-white">{contactInfo.direccion}</p>
              <p className="text-white">Email: {contactInfo.email}</p>
              <p className="text-white">Teléfono: {contactInfo.telefono}</p>
            </div>

            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4 text-center">
              <h6 className="text-uppercase fw-bold">Contacto</h6>
              <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />

              {enlaces.length > 0 ? (
                enlaces.map((enlace) => (
                  <p key={enlace.id} className="d-flex justify-content-center align-items-center">
                    {enlace.nombre === 'Facebook' && <FaFacebook className="me-2" />}
                    {enlace.nombre === 'Twitter' && <FaTwitter className="me-2" />}
                    {enlace.nombre === 'LinkedIn' && <FaLinkedin className="me-2" />}
                    {enlace.nombre === 'Instagram' && <FaInstagram className="me-2" />}
                    <a href={enlace.url} target="_blank" rel="noopener noreferrer" className="text-white">
                      {enlace.nombre}
                    </a>
                  </p>
                ))
              ) : (
                <p>No hay enlaces disponibles</p>
              )}
            </div>


          </div>
        </div>
      </section>

      <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © 2020 Copyright:
        <a className="text-white" href="https://mdbootstrap.com/"> MDBootstrap.com</a>
      </div>
    </footer>
  );
};

export default Footer;
