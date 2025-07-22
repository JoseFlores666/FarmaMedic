import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: 10,
    marginBottom: 20,
  },
  logoPlaceholder: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  clinicInfo: {
    fontSize: 10,
    color: '#34495e',
    textAlign: 'right',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    border: '1px solid #d1d5db',
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#34495e',
    width: '30%',
  },
  value: {
    width: '70%',
    color: '#2c3e50',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e9ecef',
    padding: 10,
    borderBottom: '1px solid #d1d5db',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottom: '1px solid #e0e0e0',
  },
  tableCell: {
    width: '33.33%',
    color: '#2c3e50',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    borderTop: '1px solid #e0e0e0',
    paddingTop: 10,
  },
});

const RecetaPDF = ({ paciente, doctor, fecha_inicio, fecha_fin, medicamentos }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.logoPlaceholder}>[Logo Clínica]</Text>
        <View style={styles.clinicInfo}>
          <Text>Clínica Salud Integral</Text>
          <Text>Av. Principal 123, Ciudad, País</Text>
          <Text>Tel: (123) 456-7890</Text>
        </View>
      </View>

      <Text style={styles.title}>Receta Médica</Text>

      <View style={styles.section}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Paciente:</Text>
          <Text style={styles.value}>{paciente}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Doctor:</Text>
          <Text style={styles.value}>{doctor}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Fecha de emisión:</Text>
          <Text style={styles.value}>{fecha_inicio}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Fecha de vencimiento:</Text>
          <Text style={styles.value}>{fecha_fin}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableCell}>Medicamento</Text>
          <Text style={styles.tableCell}>Dosis</Text>
          <Text style={styles.tableCell}>Instrucciones</Text>
        </View>
        {medicamentos.map((med, idx) => (
          <View key={idx} style={styles.tableRow}>
            <Text style={styles.tableCell}>{med.medicamento}</Text>
            <Text style={styles.tableCell}>{med.dosis}</Text>
            <Text style={styles.tableCell}>Cada {med.instrucciones} hrs</Text>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        Nota: Este documento es válido solo con la firma del médico. Consulte a su médico antes de suspender el tratamiento.
      </Text>
    </Page>
  </Document>
);

RecetaPDF.propTypes = {
  paciente: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    apellido: PropTypes.string.isRequired,
    edad: PropTypes.number,
    identificacion: PropTypes.string,
  }).isRequired,
  
  doctor: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    apellido: PropTypes.string.isRequired,
    especialidad: PropTypes.string,
    cedula: PropTypes.string.isRequired,
  }).isRequired,
  
  fecha_inicio: PropTypes.string.isRequired, 
  fecha_fin: PropTypes.string.isRequired,    
  
  medicamentos: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      dosis: PropTypes.string.isRequired,
      frecuencia: PropTypes.string.isRequired,
      duracion: PropTypes.string.isRequired,
      indicaciones: PropTypes.string,
    })
  ).isRequired,
};

export default RecetaPDF;