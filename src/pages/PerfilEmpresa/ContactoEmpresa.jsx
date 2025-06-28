import { Button, Container } from "react-bootstrap";
import Input from "../../components/Input";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const ContactoEmpresa = () => {
    const [direccion, setDireccion] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');

    const getContacto = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/getContactInfo`, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error("Error al obtener los datos");
            }

            const data = await response.json();

            if (data) {
                setDireccion(data.direccion || '');
                setEmail(data.email || '');
                setTelefono(data.telefono || '');
            }
        } catch (error) {
            console.error('Error obteniendo datos de contacto:', error);
        }
    };

    const updateContacto = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/upsertContactInfo`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ direccion, email, telefono }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error al actualizar los datos');
            }
            MySwal.fire({
                title: 'Éxito',
                text: 'Datos actualizados correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            });
            getContacto();
        } catch (error) {
            console.error('Error actualizando datos:', error);
            alert('Hubo un error al actualizar los datos');
        }
    };

    useEffect(() => {
        getContacto();
    }, []);

    return (
        <Container className='mb-5'>
            <h2 className="text-center mb-5">Gestion de contacto de la empresa</h2>

            <div className="mb-5">
                <Input name="direccion" id="direccion" required value={direccion} onChange={(e) => setDireccion(e.target.value)}>
                    Dirección
                </Input>
            </div>
            <div className="mb-5">
                <Input name="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)}>
                    Email
                </Input>
            </div>
            <div className="mb-5">
                <Input name="telefono" id="telefono" required value={telefono} onChange={(e) => setTelefono(e.target.value)}>
                    Teléfono
                </Input>
            </div>
            <Button variant="primary" className="mt-3" onClick={updateContacto}>
                Actualizar Datos
            </Button>
        </Container>
    );
};

export default ContactoEmpresa;
