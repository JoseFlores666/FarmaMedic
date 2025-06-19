import { useEffect, useState } from 'react';
import {
  FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaGithub,
  FaPinterest, FaTiktok, FaSnapchat, FaWhatsapp, FaReddit, FaTumblr,
  FaVimeo, FaSpotify, FaCalendarCheck, FaCalendarTimes
} from 'react-icons/fa';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import VistaDeslinde from '../../../pages/DocRegulatorio/Informacion/VistaDeslinde';
import VistaPolitica from '../../../pages/DocRegulatorio/Informacion/VistaPolitica';
import VistaTerminos from '../../../pages/DocRegulatorio/Informacion/VistaTerminos';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { Badge, Card, Col, Row } from 'react-bootstrap';

const MySwal = withReactContent(Swal);

export const Footer = () => {
  const [enlaces, setEnlaces] = useState([]);
  const [contactInfo, setContactInfo] = useState({ direccion: '', email: '', telefono: '' });
  const [horarios, setHorarios] = useState([]);
  const [showDeslindeModal, setShowDeslindeModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const openDeslindeModal = () => setShowDeslindeModal(true);
  const closeDeslindeModal = () => setShowDeslindeModal(false);
  const openDeslindeModal2 = () => setShowModal2(true);
  const closeDeslindeModal2 = () => setShowModal2(false);
  const openDeslindeModal3 = () => setShowModal3(true);
  const closeDeslindeModal3 = () => setShowModal3(false);
  const navigate = useNavigate();

  const loadEnlaces = async () => {
    try {
      const response = await fetch('https://back-farmam.onrender.com/api/getEnlaces', {
        credentials: 'include',
      });
      const data = await response.json();
      setEnlaces(data);
    } catch (error) {
      console.error('Error obteniendo enlaces:', error);
      throw error;
    }

  };

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('https://back-farmam.onrender.com/api/getContactInfo');
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
          throw error;
    }
  };

  const fetchHorarios = async () => {
    try {
      const response = await fetch('https://back-farmam.onrender.com/api/getHorarioEmpresa');
      const data = await response.json();
      const formatted = data.map(item => ({
        dia: item.dia,
        horario: `${item.hora_inicio} - ${item.hora_fin}`,
        disponible: item.activo === 1
      }));
      
      setHorarios(formatted);
    } catch (error) {
      console.error('Error al obtener horarios:', error);
      MySwal.fire('Error', 'No se pudieron cargar los horarios de atención', 'error');
    }
  };
  
    useEffect(() => {
      fetchContactInfo();
      fetchHorarios()
      loadEnlaces()
    }, []);
  return (
    <footer className="text-center text-lg-start text-white" style={{ backgroundColor: '#2c245b' }}>
      <div className="p-5">
        <div className="row">
          <div className="col-md-4">
            <h6 className=" fw-bold text-light">Informacion sobre FarmaMedic</h6>
            <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
            <p className="text-white mb-2">
              <strong>Dirección:</strong> {contactInfo.direccion}
            </p>
            <p className="text-white mb-2">
              <strong>Correo:</strong> {contactInfo.email}
            </p>
            <p className="text-white">
              <strong>Teléfono:</strong> {contactInfo.telefono}
            </p>
          </div>

          <div className="col-md-4">
            <h6 className=" fw-bold text-light">Acuerdos</h6>
            <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
          </div>

          <div className="col-md-4">
            <h6 className=" fw-bold text-light">Asistencias economica</h6>
            <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
            <ul className="list-unstyled">
              <li>Arizona</li>
              <li>Florida</li>
              <li>Minnesota</li>
            </ul>
          </div>
        </div>

        <div className="row">


          <h5 className="p-2 text-center">Horarios de Atención</h5>
          <Row className="d-flex justify-content-center align-items-center">
            {horarios.map((horario, index) => (
              <Col key={index} xs={4} sm={3} md={2} lg={2} className="p-1">
                <motion.div
                  className="d-flex justify-content-center align-items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="p-2 d-flex justify-content-center align-items-center">
                    {horario.disponible ? (
                      <FaCalendarCheck className="text-success" size={20} />
                    ) : (
                      <FaCalendarTimes className="text-danger" size={20} />
                    )}
                    <small className="fw-bold text-center">{horario.dia}</small>
                    <p className="extra-small text-center m-0">{horario.horario}</p>
                    <Badge
                      className="text-white px-2 py-1 rounded-pill"
                      bg={horario.disponible ? "success" : "danger"}
                    >
                      {horario.disponible ? "Disponible" : "No Disponible"}
                    </Badge>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>

        </div>

        <div className="row mt-4 pt text-center d-flex justify-content-center align-items-center" style={{ borderTop: '1px solid grey' }}>
          <div className="col-md-4">
            <h5 className="p-3">Sígue a FarmaMedic</h5>
            {enlaces.length > 0 ? (
              <div className="d-flex justify-content-center flex-wrap gap-3">
                {enlaces.map((enlace) => (
                  <motion.a
                    key={enlace.id}
                    href={enlace.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex text-white text-decoration-none p-3 rounded-circle border border-secondary"
                    whileHover={{ scale: 1.1, rotate: 10, transition: { type: 'spring', stiffness: 300 } }}
                    whileTap={{ scale: 1 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    color='white'
                  >
                    {enlace.nombre === 'Facebook' && <FaFacebook />}
                    {enlace.nombre === 'Twitter' && <FaTwitter />}
                    {enlace.nombre === 'LinkedIn' && <FaLinkedin />}
                    {enlace.nombre === 'Instagram' && <FaInstagram />}
                    {enlace.nombre === 'Youtube' && <FaYoutube />}
                    {enlace.nombre === 'Github' && <FaGithub />}
                    {enlace.nombre === 'Pinterest' && <FaPinterest />}
                    {enlace.nombre === 'Tiktok' && <FaTiktok />}
                    {enlace.nombre === 'Snapchat' && <FaSnapchat />}
                    {enlace.nombre === 'WhatsApp' && <FaWhatsapp />}
                    {enlace.nombre === 'Reddit' && <FaReddit />}
                    {enlace.nombre === 'Tumblr' && <FaTumblr />}
                    {enlace.nombre === 'Vimeo' && <FaVimeo />}
                    {enlace.nombre === 'Spotify' && <FaSpotify />}
                  </motion.a>
                ))}
              </div>
            ) : (
              <p className="text-white">No hay enlaces disponibles</p>
            )}
          </div>
          <div className="col-12 col-md-4 text-center"></div>

          <div className="col-12 col-md-4 text-center">
            <h5 className='p-3'>La app estará disponible pronto en:</h5>
            <div className="d-flex justify-content-center flex-wrap gap-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                className="img-fluid"
                style={{ maxWidth: '120px' }}
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Download_on_the_App_Store_RGB_blk.svg/2560px-Download_on_the_App_Store_RGB_blk.svg.png"
                alt="App Store"
                className="img-fluid"
                style={{ maxWidth: '120px' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className=" text-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        <div className="d-flex flex-wrap justify-content-center">
          <motion.small
            className="p-3"
            whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', color: 'rgb(255, 255, 255)' }}
            transition={{ duration: 0.3 }}
            style={{ cursor: 'pointer' }}
            onClick={(e) => { e.preventDefault(); openDeslindeModal3(); }}
          >
            Términos y condiciones
          </motion.small>

          <motion.small
            className="p-3"
            whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', color: 'rgb(255, 255, 255)' }}
            transition={{ duration: 0.3 }}
            style={{ cursor: 'pointer' }}
            onClick={(e) => { e.preventDefault(); openDeslindeModal2(); }}
          >
            Política de privacidad
          </motion.small>

          <motion.small
            className="p-3"
            whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', color: 'rgb(255, 255, 255)' }}
            transition={{ duration: 0.3 }}
            style={{ cursor: 'pointer' }}
            onClick={(e) => { e.preventDefault(); openDeslindeModal(); }}
          >
            Deslinde legal
          </motion.small>

          <motion.small
            className="p-3"
            style={{ cursor: 'pointer' }}
            whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', color: 'rgb(255, 255, 255)' }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate("/Inicio/Ayuda")}
          >
            Ayuda del sitio
          </motion.small>
        </div>


        <div className="text-center p-2">
          <small>&copy;1998-2025 Fundación FarmaMedic Atención Médica Todos los derechos reservados.</small>
        </div>
      </div>

      <VistaTerminos showModal={showModal3} onClose={closeDeslindeModal3} />
      <VistaPolitica showModal={showModal2} onClose={closeDeslindeModal2} />
      <VistaDeslinde showModal={showDeslindeModal} onClose={closeDeslindeModal} />
    </footer>
  );
};