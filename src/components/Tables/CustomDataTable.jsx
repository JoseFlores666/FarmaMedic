import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
const customStyles = {
  table: {
    style: {
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      backgroundColor: '#ffffff',
    },
  },
  headRow: {
    style: {
      backgroundColor: '#f1f3f4',
      borderBottom: '2px solid #e0e0e0',
      minHeight: '48px',
    },
  },
  headCells: {
    style: {
      color: '#202124',
      fontSize: '14px',
      fontWeight: 600,
      textTransform: 'uppercase',
      padding: '12px 16px',
    },
  },
  rows: {
    style: {
      minHeight: '50px',
      fontSize: '14px',
      color: '#3c4043',
      backgroundColor: '#fff',
      borderBottom: '1px solid #f0f0f0',
      transition: 'all 0.25s ease-in-out',
    },
    highlightOnHoverStyle: {
      backgroundColor: '#e6f4f4',
      borderRadius: '12px',
      transition: 'transform 0.15s ease-in-out',
    },
  },
  cells: {
    style: {
      padding: '12px 16px',
    },
  },
  pagination: {
    style: {
      borderTop: '1px solid #e0e0e0',
      backgroundColor: '#f9f9f9',
      padding: '12px 24px',
      fontSize: '14px',
      color: '#5f6368',
    },
    pageButtonsStyle: {
      borderRadius: '6px',
      height: '32px',
      width: '32px',
      padding: '6px',
      margin: '0 4px',
      backgroundColor: '#ffffff',
      color: '#202124',
      border: '1px solid #dcdcdc',
      '&:hover': {
        backgroundColor: '#e8f0fe',
        borderColor: '#d2e3fc',
      },
      '&:disabled': {
        backgroundColor: '#f1f3f4',
        color: '#9e9e9e',
        cursor: 'not-allowed',
      },
    },
  },
};


const CustomDataTable = ({
  title,
  columns,
  data,
  subHeaderComponent,
  pagination = true,
  highlightOnHover = true,
  persistTableHead = true,
  responsive = true,
}) => {
  return (
    <div className="">
      <div className="mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        subHeader
        subHeaderComponent={subHeaderComponent}
        highlightOnHover={highlightOnHover}
        persistTableHead={persistTableHead}
        responsive={responsive}
        customStyles={customStyles}
      />
    </div>
  );
};

CustomDataTable.propTypes = {
  title: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  subHeaderComponent: PropTypes.node,
  pagination: PropTypes.bool,
  highlightOnHover: PropTypes.bool,
  persistTableHead: PropTypes.bool,
  responsive: PropTypes.bool,
};

export default CustomDataTable;
