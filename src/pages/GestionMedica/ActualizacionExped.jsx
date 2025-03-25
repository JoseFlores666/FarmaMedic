import { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { FaTrash } from 'react-icons/fa';

const API_URL = 'https://localhost:4000/api/';

const getActuExpe = async (setActuExpe) => {
    try {
        const response = await fetch(`${API_URL}getActuExpe`);
        if (!response.ok) throw new Error('Error al obtener opiniones');
        const data = await response.json();
        setActuExpe(data);
    } catch (error) {
        console.error('Error al obtener opiniones:', error);
        Swal.fire('Error', error.message || 'No se pudo obtener las opiniones', 'error');
    }
};

const deleteActuExpe = async (id, setActuExpe) => {
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
                getActuExpe(setActuExpe);
            } catch (error) {
                console.error('Error al eliminar opinión:', error);
                Swal.fire('Error', 'No se pudo eliminar la opinión', 'error');
            }
        }
    });
};

const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <div className="input-group">
        <input
            type="text"
            className="form-control"
            placeholder="Buscar Doctor"
            value={filterText}
            onChange={onFilter}
        />
        <button className="btn btn-danger" onClick={onClear}>X</button>
    </div>
);

export const ActualizacionExped = () => {
    const [ActuExpe, setActuExpe] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);


    useEffect(() => {
        getActuExpe(setActuExpe);
    }, []);

    const userColumns = [
        { name: '#', selector: row => row.id, sortable: true, width: "55px" },
        { name: 'Expediente', selector: row => row.expediente_id, sortable: true },
        { name: 'Doctor', selector: row => row.nomdoc, sortable: true },
        { name: 'Descripcion', selector: row => row.descripcion, sortable: true },
        { name: 'Fecha Actualizado', selector: row => row.fecha, sortable: true },
        {
            name: 'Acción',
            cell: row => (
                <div>
                    <FaTrash
                        color='red'
                        title='Eliminar'
                        style={{ cursor: 'pointer', marginRight: 10 }}
                        onClick={() => deleteActuExpe(row.id, setActuExpe)}
                    />
                </div>
            ),
            ignoreRowClick: true,
        },
    ];

    const filteredItems = ActuExpe.filter(
        item => (item.nomdoc || '').toLowerCase().includes(filterText.toLowerCase())
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
        </div>
    );
};

FilterComponent.propTypes = {
    filterText: PropTypes.string.isRequired,
    onFilter: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
};

export default ActualizacionExped;
