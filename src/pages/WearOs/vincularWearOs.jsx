import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Spinner, Alert } from 'react-bootstrap';

const VincularWearOS = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("authData"));
    if (authData && authData.id) {
      setUserId(authData.id);
    }
  }, []);

  const generarToken = async () => {
    if (!userId) {
      alert("No se ha encontrado el ID del paciente.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://back-farmam.onrender.com/api/generar-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codpaci: userId }),
      });

      const data = await res.json();
      setToken(data.token);
    } catch (error) {
      console.error('Error al generar token:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#f9f9f9' }}>
      <Row className="w-100 justify-content-center">
        <Col xs={11} md={8} lg={6}>
          <Card className="text-center shadow p-5">
            <Card.Body>
              <Card.Title className="mb-3">Vincular con Wear OS</Card.Title>
              <Card.Text>
                Presiona el botón para generar un código de vinculación con tu reloj inteligente.
              </Card.Text>

              <Button onClick={generarToken} disabled={loading} variant="primary" className="mt-3">
                {loading ? <><Spinner as="span" animation="border" size="sm" /> Generando...</> : 'Generar código'}
              </Button>

              {token && (
                <Alert variant="success" className="mt-4">
                  <h5>Tu código:</h5>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', letterSpacing: '6px' }}>{token}</div>
                  <p className="mb-0">Ingresa este código en tu reloj para completar la vinculación.</p>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VincularWearOS;
