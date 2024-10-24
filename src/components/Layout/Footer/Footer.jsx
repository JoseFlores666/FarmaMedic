import { useEffect, useState } from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {

  const [enlaces, setEnlaces] = useState([]);

  useEffect(() => {
    const fetchEnlaces = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/getEnlaces', {
          credentials: 'include',
        });
        const data = await response.json();
        setEnlaces(data); // Asume que `data` es un array de objetos con las propiedades 'id', 'url', y 'nombre'.
      } catch (error) {
        console.error('Error obteniendo enlaces:', error);
      }
    };
    
    fetchEnlaces();
  }, []);

  return (
    <div className="">
      <footer className="text-center text-lg-start text-white" style={{ backgroundColor: '#1c2331' }}>
       
        <section className="d-flex justify-content-between p-4">
          <div className="container text-center text-md-start mt-5">
            <div className="row mt-3">
              <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold">Company name</h6>
                <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                <p>
                  Here you can use rows and columns to organize your footer content. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </p>
              </div>

              <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold">Products</h6>
                <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                <p>
                  <a href="#!" className="text-white">MDBootstrap</a>
                </p>
                <p>
                  <a href="#!" className="text-white">MDWordPress</a>
                </p>
                <p>
                  <a href="#!" className="text-white">BrandFlow</a>
                </p>
                <p>
                  <a href="#!" className="text-white">Bootstrap Angular</a>
                </p>
              </div>

              <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold">Useful links</h6>
                <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                <p>
                  <a href="#!" className="text-white">Your Account</a>
                </p>
                <p>
                  <a href="#!" className="text-white">Become an Affiliate</a>
                </p>
                <p>
                  <a href="#!" className="text-white">Shipping Rates</a>
                </p>
                <p>
                  <a href="#!" className="text-white">Help</a>
                </p>
              </div>

              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                <h6 className="text-uppercase fw-bold">Contact</h6>
                <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                {enlaces.length > 0 ? (
                  enlaces.map((enlace) => (
                    <p key={enlace.id} className="d-flex align-items-center">
                         {enlace.nombre === 'Facebook' && <FaFacebook className="me-2" />}
                                        {enlace.nombre === 'Twitter' && <FaTwitter className="me-2" />}
                                        {enlace.nombre === 'LinkedIn' && <FaLinkedin className="me-2" />}
                                        {enlace.nombre === 'Instagram' && <FaInstagram className="me-2" />}
                      <a href={enlace.url} target="_blank" rel="noopener noreferrer" className="text-white">{enlace.nombre}</a>
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
          <a className="text-white" href="https://mdbootstrap.com/">MDBootstrap.com</a>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
