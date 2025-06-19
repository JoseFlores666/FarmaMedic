import PropTypes from 'prop-types';
import { Col, Form, Row } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

const FilterComponent = ({
  filterText,
  onFilter,
  onClear,
  onShowModal,
  buttonText,
  selectedField,
  onFieldChange,
  fieldsToShow = [],
}) => {
  const inputType = selectedField === 'fecha_cita' || selectedField === 'fecha'
    ? 'date'
    : 'text';

  const placeholderMap = {
    doctor: 'Buscar doctor',
    paciente: 'Buscar paciente',
    estado: 'Buscar estado',
    especialidad: 'Buscar especialidad',
    fecha_cita: 'Filtrar por fecha',
    fecha: 'Filtrar por fecha',
    correo: 'Filtrar por correo',
    medicamento: 'Filtrar por medicamento',
  };

  return (
    <div className='w-100'>
      <Row className="align-items-center">
        <Col>
          <div className='input-group'>
            <input
              type={inputType}
              className="form-control"
              placeholder={placeholderMap[selectedField] || 'Buscar...'}
              value={filterText}
              onChange={onFilter}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={onClear}
            >
              Limpiar
            </button>
          </div>
        </Col>

        <Col>
          <Form className="d-flex gap-2 justify-content-center">
            {fieldsToShow.includes('doctor') && (
              <Form.Check
                inline
                label="Doctor"
                name="filterField"
                type="radio"
                id="radio-doctor"
                value="doctor"
                checked={selectedField === 'doctor'}
                onChange={onFieldChange}
              />
            )}
            {fieldsToShow.includes('paciente') && (
              <Form.Check
                inline
                label="Paciente"
                name="filterField"
                type="radio"
                id="radio-paciente"
                value="paciente"
                checked={selectedField === 'paciente'}
                onChange={onFieldChange}
              />
            )}
            {fieldsToShow.includes('fecha_cita') && (
              <Form.Check
                inline
                label="Fecha"
                name="filterField"
                type="radio"
                id="radio-fecha-cita"
                value="fecha_cita"
                checked={selectedField === 'fecha_cita'}
                onChange={onFieldChange}
              />
            )}
            {fieldsToShow.includes('estado') && (
              <Form.Check
                inline
                label="Estado"
                name="filterField"
                type="radio"
                id="radio-estado"
                value="estado"
                checked={selectedField === 'estado'}
                onChange={onFieldChange}
              />
            )}
            {fieldsToShow.includes('especialidad') && (
              <Form.Check
                inline
                label="Especialidad"
                name="filterField"
                type="radio"
                id="radio-especialidad"
                value="especialidad"
                checked={selectedField === 'especialidad'}
                onChange={onFieldChange}
              />
            )}
            {fieldsToShow.includes('fecha') && (
              <Form.Check
                inline
                label="Fecha"
                name="filterField"
                type="radio"
                id="radio-fecha"
                value="fecha"
                checked={selectedField === 'fecha'}
                onChange={onFieldChange}
              />
            )}
            {fieldsToShow.includes('correo') && (
              <Form.Check
                inline
                label="Correo"
                name="filterField"
                type="radio"
                id="radio-correo"
                value="correo"
                checked={selectedField === 'correo'}
                onChange={onFieldChange}
              />
            )}
                {fieldsToShow.includes('medicamento') && (
              <Form.Check
                inline
                label="Medicamento"
                name="filterField"
                type="radio"
                id="radio-medicamento"
                value="medicamento"
                checked={selectedField === 'medicamento'}
                onChange={onFieldChange}
              />
            )}
          </Form>
        </Col>

        <Col className="text-end">
          {buttonText && (
            <button
              className="btn btn-primary"
              type="button"
              onClick={onShowModal}
            >
              <FaPlus /> {buttonText}
            </button>
          )}
        </Col>
      </Row>
    </div>
  );
};

FilterComponent.propTypes = {
  filterText: PropTypes.string.isRequired,
  onFilter: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onShowModal: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  selectedField: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  fieldsToShow: PropTypes.arrayOf(PropTypes.string),
};

export default FilterComponent;
