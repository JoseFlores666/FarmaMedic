import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "#f8f9fa",
  },
    logo: { width: 150, height: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#2c3e50",
  },
  section: {
    marginBottom: 20,
    padding: 15,
    border: "1px solid #d1d5db",
    borderRadius: 5,
    backgroundColor: "#ffffff",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: { fontWeight: "bold", color: "#34495e", width: "30%" },
  value: { width: "70%", color: "#2c3e50" },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e9ecef",
    padding: 10,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottom: "1px solid #e0e0e0",
  },
  tableCell: { width: "33.33%" },
});

const RecetaPDF = ({ paciente, doctor, fecha_inicio, fecha_fin, medicamentos, logo }) => {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          {logo ? (
            <Image src={logo} style={styles.logo} />
          ) : (
            <Text>[Logo Clínica]</Text>
          )}
          <Text>Clínica Salud Integral - Receta Médica</Text>
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
            <Text style={styles.label}>Inicio:</Text>
            <Text style={styles.value}>{fecha_inicio}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Finaliza:</Text>
            <Text style={styles.value}>{fecha_fin}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Medicamento</Text>
            <Text style={styles.tableCell}>Dosis</Text>
            <Text style={styles.tableCell}>Instrucciones</Text>
          </View>

          {(medicamentos || []).map((m, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableCell}>{m.medicamento || m.nombre || "N/A"}</Text>
              <Text style={styles.tableCell}>{m.dosis || "N/A"}</Text>
              <Text style={styles.tableCell}>{m.instrucciones || m.indicaciones || "N/A"}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default RecetaPDF;

RecetaPDF.propTypes = {
  paciente: PropTypes.oneOfType([
    PropTypes.shape({
      nombre: PropTypes.string.isRequired,
    }),
    PropTypes.string
  ]).isRequired,

  doctor: PropTypes.oneOfType([
    PropTypes.shape({
      nombre: PropTypes.string.isRequired,
    }),
    PropTypes.string
  ]).isRequired,

  fecha_inicio: PropTypes.string.isRequired,
  fecha_fin: PropTypes.string.isRequired,

  medicamentos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      medicamento: PropTypes.string.isRequired,
      dosis: PropTypes.string.isRequired,
      instrucciones: PropTypes.string,
    })
  ).isRequired,
  logo: PropTypes.string,
};
