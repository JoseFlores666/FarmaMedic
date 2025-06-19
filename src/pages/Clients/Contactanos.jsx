import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

export const Contactanos = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        titulo: '',
        mensaje: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://back-farmam.onrender.com/api/enviarMensaje', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                alert('Mensaje enviado correctamente');
                setFormData({ nombre: '', correo: '', titulo: '', mensaje: '' });
            } else {
                alert('Error al enviar mensaje: ' + data.message);
            }
        } catch (err) {
            console.error(err);
            alert('Error al enviar mensaje');
        }
    };

    return (
            <Row className="align-items-center">
                <Col md={7}>
                    <div className="contact-left">
                        <iframe
                            src="https://maps.google.com/maps?width=286&amp;height=217&amp;hl=en&amp;q=san%20felipe%20orizatlan%20+(far)&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                            width="100%"
                            height="535"
                            loading="lazy"
                            title="Location Map"
                            style={{ border: 0 }}
                            allowFullScreen
                        ></iframe>
                    </div>
                </Col>

                <Col md={5}>
                    <div className="contact-right text-white p-4 rounded" style={{ backgroundColor: "#2c245b" }}>
                        <div className="contact-head text-center">
                            <h4>Contáctanos</h4>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-2">
                                <Form.Label>Nombre:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu nombre completo"
                                />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>Correo electrónico:</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    placeholder="ejemplo@correo.com"
                                />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>Título:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="titulo"
                                    value={formData.titulo}
                                    onChange={handleChange}
                                    placeholder="Escribe un título para tu mensaje"
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Mensaje:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="mensaje"
                                    value={formData.mensaje}
                                    onChange={handleChange}
                                    placeholder="Escribe tu mensaje aquí"
                                    style={{ resize: 'none' }}
                                />
                            </Form.Group>

                            <Button type="submit" variant="light" className="btn-submit">
                                <i className="fas fa-arrow-right"></i> Enviar Mensaje
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
    );
};
