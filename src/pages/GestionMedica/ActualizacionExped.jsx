import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { FaTrash } from 'react-icons/fa';
import CustomDataTable from '../../components/Tables/CustomDataTable';
import FilterComponent from '../../components/FilterComponent';
const API_URL = 'https://back-farmam.onrender.com/api/';

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

export const ActualizacionExped = () => {
    const [ActuExpe, setActuExpe] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [selectedField, setSelectedField] = useState('doctor');


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
    const filteredItems = (ActuExpe || []).filter(item => {
        const filter = filterText.toLowerCase();
        let fieldValue = '';

        switch (selectedField) {
            case 'paciente':
                fieldValue = item.paciente?.toLowerCase() || '';
                break;
            case 'doctor':
                fieldValue = item.doctor?.toLowerCase() || '';
                break;

            case 'fecha':
                fieldValue = item.fecha || '';
                break;
            default:
                return true;
        }

        return fieldValue.includes(filter);
    });


    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        const handleFieldChange = (e) => {
            setSelectedField(e.target.value);
        };

        return (
            <FilterComponent
                onFilter={e => setFilterText(e.target.value)}
                onClear={handleClear}
                filterText={filterText}
                buttonText={''}
                selectedField={selectedField}
                onFieldChange={handleFieldChange}
                fieldsToShow={['doctor', 'fecha']}
            />
        );
    }, [filterText, resetPaginationToggle, selectedField]);

    return (
        <div className=''>
            <CustomDataTable
                title="Actualizacion de Expedientes"
                columns={userColumns}
                data={filteredItems}
                subHeaderComponent={subHeaderComponentMemo}
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
