import { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import { Button, Form } from 'react-bootstrap';

const API_URL = 'https://back-farmam.onrender.com/api/';
const authData = JSON.parse(localStorage.getItem("authData"));
const userId = authData ? authData.id : null;
const getOpinions = async (setOpinions) => {
    try {
        const response = await fetch(`${API_URL}getOpinions`);
        if (!response.ok) throw new Error('Error al obtener opiniones');
        const data = await response.json();
        setOpinions(data);
    } catch (error) {
        console.error('Error al obtener opiniones:', error);
        Swal.fire('Error', error.message || 'No se pudo obtener las opiniones', 'error');
    }
};

const deleteOpinion = async (id, setOpinions) => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_URL}deleteOpinion/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Error al eliminar la opinión');
                Swal.fire('Eliminado', 'La opinión ha sido eliminada', 'success');
                getOpinions(setOpinions);
            } catch (error) {
                console.error('Error al eliminar opinión:', error);
                Swal.fire('Error', 'No se pudo eliminar la opinión', 'error');
            }
        }
    });
};

const FilterComponent = ({ filterText, onFilter, onClear, openModal }) => (
    <div className="input-group">
        <input
            type="text"
            className="form-control"
            placeholder="Buscar opinión"
            value={filterText}
            onChange={onFilter}
        />
        <button className="btn btn-danger" onClick={onClear}>X</button>
        <button className="btn btn-success" onClick={openModal}>Añadir Opinión</button>
    </div>
);

export const GestionOpiniones = () => {
    const [opinions, setOpinions] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [opinionData, setOpinionData] = useState({ id: null, user_id: userId, rating: '', opinion: '' });

    useEffect(() => {
        getOpinions(setOpinions);
    }, []);

    const handleInputChange = (e) => {
        setOpinionData({ ...opinionData, [e.target.name]: e.target.value });
    };

    const openModal = () => {
        setOpinionData({ id: null, user_id: userId, rating: '', opinion: '' });
        setShowModal(true);
    };

    const saveOpinion = async () => {
        try {
            const method = opinionData.id ? 'PUT' : 'POST';
            const url = opinionData.id ? `${API_URL}updateOpinion/${opinionData.id}` : `${API_URL}createOpinion`;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(opinionData),
            });

            if (!response.ok) throw new Error('Error al guardar la opinión');

            Swal.fire('Éxito', `Opinión ${opinionData.id ? 'actualizada' : 'creada'} correctamente`, 'success');
            getOpinions(setOpinions);
            setShowModal(false);
        } catch (error) {
            console.error('Error al guardar opinión:', error);
            Swal.fire('Error', 'No se pudo guardar la opinión', 'error');
        }
    };

    const userColumns = [
        { name: '#', selector: row => row.id, sortable: true, width: "55px" },
        { name: 'Cliente', selector: row => row.usuario_nombre, sortable: true },
        { name: 'Rating', selector: row => row.rating, sortable: true },
        { name: 'Opinión', selector: row => row.opinion, sortable: true },
        { name: 'Me gusta', selector: row => row.megusta, sortable: true },
        { name: 'No me gusta', selector: row => row.nomegusta, sortable: true },
        {
            name: 'Acción',
            cell: row => (
                <div>
                    <FaTrash
                        color='red'
                        title='Eliminar'
                        style={{ cursor: 'pointer', marginRight: 10 }}
                        onClick={() => deleteOpinion(row.id, setOpinions)}
                    />
                    <FaEdit
                        color='blue'
                        title='Editar'
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            setOpinionData(row);
                            setShowModal(true);
                        }}
                    />
                </div>
            ),
            ignoreRowClick: true,
        },
    ];

    const filteredItems = opinions.filter(
        item => (item.usuario_nombre || '').toLowerCase().includes(filterText.toLowerCase())
    );

    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        return (
            <FilterComponent
                onFilter={e => setFilterText(e.target.value)}
                onClear={handleClear}
                filterText={filterText}
                openModal={openModal}
            />
        );
    }, [filterText, resetPaginationToggle]);

    return (
        <div className='mt-5'>
            <DataTable
                title="Gestión de Opiniones"
                columns={userColumns}
                data={filteredItems}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 20, 50]}
                paginationResetDefaultPage={resetPaginationToggle}
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
                persistTableHead
                highlightOnHover
                responsive
            />
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{opinionData.id ? 'Editar' : 'Crear'} Opinión</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <Form.Control
                                type="number"
                                name="rating"
                                value={opinionData.rating}
                                onChange={handleInputChange}
                                min="1" max="5"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Opinión</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="opinion"
                                value={opinionData.opinion}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
                    <Button variant="primary" onClick={saveOpinion}>{opinionData.id ? 'Actualizar' : 'Crear'}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

FilterComponent.propTypes = {
    filterText: PropTypes.string.isRequired,
    onFilter: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
};

export default GestionOpiniones;
