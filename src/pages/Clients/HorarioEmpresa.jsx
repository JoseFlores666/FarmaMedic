import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import Swal from "sweetalert2";
const diasSemana = [
  "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
];

export default function HorarioEmpresaCrud() {
  const [horarios, setHorarios] = useState([]);
  const [form, setForm] = useState({
    dia: "",
    hora_inicio: "",
    hora_fin: "",
    activo: false,
  });
  const [editId, setEditId] = useState(null);

  const fetchHorarios = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/getHorarioEmpresa`);
    const data = await res.json();

    const dataOrdenada = data.sort(
      (a, b) => diasSemana.indexOf(a.dia) - diasSemana.indexOf(b.dia)
    );

    setHorarios(dataOrdenada);
  };

  useEffect(() => {
    fetchHorarios();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const diasExistentes = horarios.map(h => h.dia);

    if (!editId && diasExistentes.length >= 7) {
      Swal.fire("Error", "Ya se han registrado los 7 días de la semana.", "warning");
      return;
    }

    if (!editId && diasExistentes.includes(form.dia)) {
      Swal.fire("Error", "Este día ya ha sido registrado.", "error");
      return;
    }

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `${import.meta.env.VITE_API_URL}/updateHorarioEmpresa/${editId}`
      : `${import.meta.env.VITE_API_URL}/crearHorarioEmpresa`;

    const payload = {
      ...form,
      activo: form.activo ? 1 : 0,
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      fetchHorarios();
      setForm({ dia: "", hora_inicio: "", hora_fin: "", activo: false });
      setEditId(null);
      Swal.fire(
        editId ? "Actualizado" : "Agregado",
        `Horario ${editId ? "actualizado" : "agregado"} correctamente`,
        "success"
      );
    } else {
      Swal.fire("Error", "Ocurrió un error al guardar el horario.", "error");
    }
  };

  const handleEdit = (horario) => {
    setForm({
      ...horario,
      activo: horario.activo === 1,
    });
    setEditId(horario.id);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esto eliminará el horario del día seleccionado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/deleteHorarioEmpresa/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchHorarios();
        Swal.fire("Eliminado", "El horario ha sido eliminado.", "success");
      } else {
        Swal.fire("Error", "No se pudo eliminar el horario.", "error");
      }
    }
  };

  return (
    <Container className="py-4">
      <h3 className="text-primary mb-3">Gestión del horario de la Empresa</h3>

      <Form onSubmit={handleSubmit}>
        <Row className="g-3 mb-4 align-items-center">
          <Col md={3}>
            <Form.Select name="dia" value={form.dia} onChange={handleChange} required>
              <option value="">Selecciona un día</option>
              {diasSemana.map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Control
              type="time"
              name="hora_inicio"
              value={form.hora_inicio}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="time"
              name="hora_fin"
              value={form.hora_fin}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={2}>
            <Form.Check
              type="switch"
              id="activo-switch"
              label={form.activo ? "Activo" : "Inactivo"}
              name="activo"
              checked={form.activo}
              onChange={handleChange}
            />
          </Col>
          <Col md={3} className="d-flex gap-2">
            <Button type="submit" variant={editId ? "warning" : "primary"}>
              {editId ? "Actualizar" : "Agregar"}
            </Button>
            {editId ? (
              <Button
                variant="secondary"
                onClick={() => {
                  setForm({ dia: "", hora_inicio: "", hora_fin: "", activo: false });
                  setEditId(null);
                }}
              >
                Cancelar
              </Button>
            ) : (
              <Button
                variant="outline-secondary"
                onClick={() =>
                  setForm({ dia: "", hora_inicio: "", hora_fin: "", activo: false })
                }
              >
                Limpiar Campos
              </Button>
            )}
          </Col>


        </Row>
      </Form>

      <Table bordered responsive hover>
        <thead className="table-primary">
          <tr>
            <th>Día</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {horarios.map((h) => (
            <tr key={h.id}>
              <td>{h.dia}</td>
              <td>{h.hora_inicio}</td>
              <td>{h.hora_fin}</td>
              <td>{h.activo ? "Sí" : "No"}</td>
              <td>
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => handleEdit(h)}
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(h.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
