import { useEffect, useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FaTimes, FaWhatsapp, FaFacebook, FaTwitter, FaTelegram } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { getNoticias } from '../../Api/obtNoticias';

const NoticiasPost = () => {
  const [noticias, setNoticias] = useState([]);
  const [ocultas, setOcultas] = useState([]); // Guardar IDs ocultos
  const [compartirAbierto, setCompartirAbierto] = useState(null); // id noticia que muestra opciones compartir

  const primaryColor = '#2c245b';

const compartirEnRedSocial = (red, noticia) => {
  // Reemplaza esta URL por la real pública o base de tu app en producción
  const baseUrl = 'https://tu-dominio-publico.com'; 
  const urlNoticia = `${baseUrl}/Inicio/Noticias`; // O la URL específica de la noticia si tienes

  const mensaje = `${noticia.titulo} - ${noticia.descripcion}`;
  let compartirUrl = '';

  switch (red) {
    case 'whatsapp':
      // WhatsApp pone todo en un solo parámetro "text"
      compartirUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje + ' ' + urlNoticia)}`;
      break;
    case 'facebook':
      // Facebook usa solo URL para compartir
      compartirUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlNoticia)}`;
      break;
    case 'twitter':
      // Twitter usa texto y url separados para que aparezca el link correctamente
      compartirUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(mensaje)}&url=${encodeURIComponent(urlNoticia)}`;
      break;
    case 'telegram':
      // Telegram usa url y texto separados
      compartirUrl = `https://t.me/share/url?url=${encodeURIComponent(urlNoticia)}&text=${encodeURIComponent(mensaje)}`;
      break;
    default:
      return;
  }

  window.open(compartirUrl, '_blank');
};


  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const response = await getNoticias();
        setNoticias(response);
      } catch (error) {
        console.error('Error al obtener noticias:', error);
      }
    };

    fetchNoticias();
  }, []);

  const handleOcultar = (id) => {
    setOcultas((prev) => [...prev, id]);
  };

  const handleAnular = (id) => {
    setOcultas((prev) => prev.filter((ocultoId) => ocultoId !== id));
  };

  const toggleCompartir = (id) => {
    setCompartirAbierto((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mt-5 mb-5">
      <Row className="justify-content-center">
        <Col md={8}>
          {noticias.map((noticia) => {
            const estaOculta = ocultas.includes(noticia.id);
            const estaCompartiendo = compartirAbierto === noticia.id;

            return (
              <AnimatePresence key={noticia.id}>
                {!estaOculta ? (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="mb-4 position-relative"
                  >
                    <Card className="shadow-lg border-0 rounded overflow-hidden position-relative">

                      <Card.Body className="p-3 text-white" style={{ backgroundColor: primaryColor }}>
                        <Row className="align-items-center">
                          <Col md={2} className="text-center">
                            <img
                              src={noticia.logo_url}
                              alt="Logo"
                              width={100}
                              height={40}
                            />
                          </Col>

                          <Col xs={9}>
                            <h6 className="fw-bold mb-0">{noticia.titulo}</h6>
                            <small>{noticia.descripcion}</small>
                          </Col>

                          <Col md={1} className="text-end">
                            <Button
                              variant="link"
                              className="position-absolute top-0 end-0 m-2 text-white fw-bold fs-5"
                              onClick={() => handleOcultar(noticia.id)}
                              style={{ zIndex: 10 }}
                            >
                              <FaTimes />
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>

                      <div>
                        <img
                          src={noticia.imagen}
                          alt={noticia.titulo}
                          className="img-fluid w-100"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>

                      <Card.Footer
                        className="text-end p-3"
                        style={{ backgroundColor: primaryColor, position: 'relative' }}
                      >
                        <Button
                          variant="light"
                          size="sm"
                          className="fw-bold"
                          onClick={() => toggleCompartir(noticia.id)}
                        >
                          Compartir
                        </Button>

                        {/* Menú de opciones de compartir */}
                        <AnimatePresence>
                          {estaCompartiendo && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              style={{
                                position: 'absolute',
                                right: '1rem',
                                bottom: '3rem',
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                zIndex: 1000,
                                padding: '0.3rem 0.5rem',
                                display: 'flex',
                                gap: '0.5rem',
                              }}
                            >
                              <Button
                                variant="outline-success"
                                size="sm"
                                title="Compartir por WhatsApp"
                                onClick={() => compartirEnRedSocial('whatsapp', noticia)}
                              >
                                <FaWhatsapp />
                              </Button>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                title="Compartir por Facebook"
                                onClick={() => compartirEnRedSocial('facebook', noticia)}
                              >
                                <FaFacebook />
                              </Button>
                              <Button
                                variant="outline-info"
                                size="sm"
                                title="Compartir por Twitter"
                                onClick={() => compartirEnRedSocial('twitter', noticia)}
                              >
                                <FaTwitter />
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                title="Compartir por Telegram"
                                onClick={() => compartirEnRedSocial('telegram', noticia)}
                              >
                                <FaTelegram />
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card.Footer>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4 }}
                    className="mb-4"
                  >
                    <Card
                      className="shadow-lg border-0 rounded d-flex flex-row justify-content-between align-items-center p-3 text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <div className="d-flex align-items-center">
                        <div
                          className="bg-white text-dark rounded-circle d-flex justify-content-center align-items-center me-3"
                          style={{ width: 28, height: 28 }}
                        >
                          <FaTimes size={14} />
                        </div>
                        <div>
                          <div className="fw-semibold">Oculta</div>
                          <small>Contenido ocultado para mejorar tu experiencia.</small>
                        </div>
                      </div>
                      <Button
                        variant="light"
                        size="sm"
                        className="fw-bold px-3"
                        onClick={() => handleAnular(noticia.id)}
                      >
                        Anular
                      </Button>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </Col>
      </Row>
    </div>
  );
};

export default NoticiasPost;
