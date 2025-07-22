import { useEffect, useState } from 'react';
import {
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardImage,
} from 'mdb-react-ui-kit';
import { motion } from 'framer-motion';
import { getNoticias } from '../../Api/obtNoticias';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const Noticias = () => {
    const [noticias, setNoticias] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const cargarNoticias = async () => {
            try {
                const data = await getNoticias();
                setNoticias(data.slice(0, 4));
            } catch (error) {
                console.error('Error al cargar noticias:', error.message);
            }
        };
        cargarNoticias();
    }, []);

    const OverlayContent = ({ titulo, descripcion, showDescription = true }) => (
        <div
            className="d-flex flex-column justify-content-end h-100 p-3"
            style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                position: 'absolute',
                bottom: 0,
                width: '100%',
                color: 'white'
            }}
        >
            <motion.h5
                className="mb-1"
                style={{ fontSize: '1.1rem' }}
                whileHover={{ scale: 1.03 }}
            >
                {titulo}
            </motion.h5>
            {showDescription && (
                <motion.p
                    className="mb-2"
                    style={{ fontSize: '0.9rem' }}
                    whileHover={{ scale: 1.02 }}
                >
                    {descripcion}
                </motion.p>
            )}
            <hr style={{ borderTop: '2px solid white', width: '50px', marginLeft: 0 }} />
        </div>
    );

    if (noticias.length < 4) {
        return <p className="text-center">Cargando noticias...</p>;
    }

    return (
        <div className="">
            <div className="text-center">
                <h5 className="text-muted mb-2">Noticias destacadas</h5>
                <h2 className="display-6 fw-semibold">Mantente informado con FarmaMedic</h2>
            </div>

            <MDBRow>
                <MDBCol md='8'>
                    <div className='pb-3'>
                        <motion.div whileHover={{ scale: 1.02 }} className="w-100 h-100">
                            <MDBCard className="position-relative" style={{ height: '300px', overflow: 'hidden' }}>
                                <MDBCardImage
                                    src={noticias[0].imagen}
                                    alt={noticias[0].titulo}
                                    position='top'
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        objectFit: 'cover',
                                        filter: 'brightness(90%)'
                                    }}
                                />
                                <div className="position-absolute top-0 start-0 w-100 h-100 p-0">
                                    <OverlayContent
                                        titulo={noticias[0].titulo}
                                        descripcion={noticias[0].descripcion}
                                    />
                                </div>
                            </MDBCard>
                        </motion.div>
                    </div>

                    <MDBRow>
                        <MDBCol md='6' className="pb-2 pb-md-0">
                            <motion.div whileHover={{ scale: 1.02 }} className="w-100 h-100">
                                <MDBCard className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                                    <MDBCardImage
                                        src={noticias[1].imagen}
                                        alt={noticias[1].titulo}
                                        position='top'
                                        style={{
                                            height: '100%',
                                            width: '100%',
                                            objectFit: 'cover',
                                            filter: 'brightness(85%)'
                                        }}
                                    />
                                    <div className="position-absolute top-0 start-0 w-100 h-100 p-0">
                                        <OverlayContent
                                            titulo={noticias[1].titulo}
                                            descripcion={noticias[1].descripcion}
                                        />
                                    </div>
                                </MDBCard>
                            </motion.div>
                        </MDBCol>
                        <MDBCol md='6'>
                            <motion.div whileHover={{ scale: 1.02 }} className="w-100 h-100">
                                <MDBCard className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                                    <MDBCardImage
                                        src={noticias[2].imagen}
                                        alt={noticias[2].titulo}
                                        position='top'
                                        style={{
                                            height: '100%',
                                            width: '100%',
                                            objectFit: 'cover',
                                            filter: 'brightness(85%)'
                                        }}
                                    />
                                    <div className="position-absolute top-0 start-0 w-100 h-100 p-0">
                                        <OverlayContent
                                            titulo={noticias[2].titulo}
                                            descripcion={noticias[2].descripcion}
                                        />
                                    </div>
                                </MDBCard>
                            </motion.div>
                        </MDBCol>
                    </MDBRow>
                </MDBCol>

                <MDBCol md='4'>
                    <motion.div whileHover={{ scale: 1.02 }} className="w-100 h-100">
                        <MDBCard className="position-relative" style={{ height: '520px', overflow: 'hidden' }}>
                            <MDBCardImage
                                src={noticias[3].imagen}
                                alt={noticias[3].titulo}
                                position='top'
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    objectFit: 'cover',
                                    filter: 'brightness(85%)'
                                }}
                            />
                            <div className="position-absolute top-0 start-0 w-100 h-100 p-0">
                                <OverlayContent
                                    titulo={noticias[3].titulo}
                                    descripcion={noticias[3].descripcion}
                                />
                            </div>
                        </MDBCard>
                    </motion.div>
                </MDBCol>
            </MDBRow>

            <div className="text-center mt-4">
                <Button onClick={() => navigate('/Inicio/Noticias')} variant="outline-primary" size="lg">
                    Mostrar todas las noticias
                </Button>
            </div>

        </div>
    );
};

Noticias.propTypes = {
    titulo: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    showDescription: PropTypes.bool,
};