import { useEffect, useState } from "react";
import { Button, Form, Col, Row, InputGroup, FloatingLabel } from "react-bootstrap";
import { Wheel } from "react-custom-roulette";
import { FaImage, FaPalette, FaPlus, FaSave, FaTags, FaTimes, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

import { getWheels, getWheelActive, getWheelById, insertDataWheel, updateWheelById, deleteWheelById, } from "../../Api/ruletaService";

export default function AdminRuleta() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const [ruletas, setRuletas] = useState([]);
  const [selectedRuleta, setSelectedRuleta] = useState(null);

  const [ruletaName, setRuletaName] = useState("");
  const [colors, setColors] = useState([]);
  const [offers, setOffers] = useState([]);
  const [image, setImage] = useState(null);
  const [isActive, setIsActive] = useState(0);
  const [data, setData] = useState([]);

  const [newRuletaName, setNewRuletaName] = useState("");
  const [creatingNew, setCreatingNew] = useState(false);

  const defaultColors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"];
  const defaultOffers = [
    { option: "Oferta 1", textColor: "#000000" },
    { option: "Oferta 2", textColor: "#000000" },
    { option: "Oferta 3", textColor: "#000000" },
    { option: "Oferta 4", textColor: "#000000" },
  ];
  const defaultImage = "https://via.placeholder.com/300x200.png?text=Ruleta+Nueva";

  const handleStartCreate = () => {
    setSelectedRuleta(null);
    setColors(defaultColors);
    setOffers(defaultOffers);
    setImage(defaultImage);
    setIsActive(0);
    setData(
      defaultOffers.map((o, idx) => ({
        option: o.option,
        style: { backgroundColor: defaultColors[idx] || "#ffffff", textColor: o.textColor },
      }))
    );
    setNewRuletaName("");
    setCreatingNew(true);
  };

  const handleCancelCreate = async () => {
    try {
      const resRuletas = await getWheels();
      setRuletas(resRuletas || []);

      const ruletaActiva = await getWheelActive();
      if (ruletaActiva?.id) handleSelectRuleta(ruletaActiva.id);
    } catch (err) {
      console.error("Error al restaurar ruleta:", err);
    } finally {
      setCreatingNew(false);
    }
  };
  const handleCreateRuleta = async () => {
    if (!newRuletaName.trim()) {
      return Swal.fire("⚠️ Ojo", "Ingresa un nombre para la ruleta", "warning");
    }

    try {
      const data = new FormData();
      data.append("nombre", newRuletaName);
      data.append("isActive", isActive);
      data.append("colores", JSON.stringify(colors));
      data.append("ofertas", JSON.stringify(offers));

      if (image instanceof File) {
        data.append("imagen", image); // 👈 se manda archivo a Cloudinary
      }

      await insertDataWheel(data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Listo", "Ruleta creada con éxito", "success");
      setNewRuletaName("");
      setCreatingNew(false);

      const resRuletas = await getWheels();
      setRuletas(resRuletas || []);

      const ruletaActiva = await getWheelActive();
      if (ruletaActiva?.id) handleSelectRuleta(ruletaActiva.id);
    } catch (error) {
      console.error("Error creando ruleta:", error);
      Swal.fire("Error", "No se pudo crear la ruleta", "error");
    }
  };


  const handleDeleteRuleta = async () => {
    if (!selectedRuleta) {
      return Swal.fire("⚠️ Ojo", "Selecciona una ruleta para eliminar", "warning");
    }

    const confirm = await Swal.fire({
      title: "¿Eliminar ruleta?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteWheelById(selectedRuleta);
      Swal.fire("🗑 Eliminada", "Ruleta eliminada con éxito", "success");

      const resRuletas = await getWheels();
      setRuletas(resRuletas || []);

      const ruletaActiva = await getWheelActive();
      if (ruletaActiva?.id) {
        handleSelectRuleta(ruletaActiva.id);
      } else {
        setSelectedRuleta(null);
        setColors([]);
        setOffers([]);
        setImage(null);
        setIsActive(0);
        setData([]);
      }
    } catch (error) {
      console.error("Error eliminando ruleta:", error);
      Swal.fire("❌ Error", "No se pudo eliminar la ruleta", "error");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resRuletas = await getWheels();
        setRuletas(resRuletas || []);
      } catch (err) {
        console.error("Error cargando ruletas:", err);
        setRuletas([]);
      }

      try {
        const ruletaActiva = await getWheelActive();
        if (ruletaActiva?.id) handleSelectRuleta(ruletaActiva.id);
      } catch (err) {
        console.warn("No hay ruleta activa:", err);
      }
    };

    fetchData();
  }, []);

  const handleSelectRuleta = async (id) => {
    try {
      const res = await getWheelById(id);
      const { nombre = "", colores = [], ofertas = [], imagen = null, isActive = 0 } = res || {};

      const coloresSolo = colores.map((c) => c?.color || "#ffffff");
      const ofertasNormalizadas = ofertas.map((o) => ({
        option: o?.oferta || "Sin oferta",
        textColor: o?.colorTexto || "#000000",
      }));

      const opciones = ofertasNormalizadas.map((o, idx) => ({
        option: o.option,
        style: {
          backgroundColor: coloresSolo[idx] || "#ffffff",
          textColor: o.textColor,
        },
      }));

      setSelectedRuleta(id);
      setRuletaName(nombre);
      setColors(coloresSolo);
      setOffers(ofertasNormalizadas);
      setImage(imagen);
      setIsActive(isActive);
      setData(opciones);
      setCreatingNew(false);
    } catch (err) {
      console.error("Error cargando datos de ruleta:", err);
      setColors([]);
      setOffers([]);
      setData([]);
    }
  };
  const handleSave = async () => {
    if (!selectedRuleta) return;

    try {
      const data = new FormData();
      data.append("nombre", ruletaName);
      data.append("isActive", isActive);
      data.append("colores", JSON.stringify(colors));
      data.append("ofertas", JSON.stringify(offers));

      if (image instanceof File) {
        data.append("imagen", image); // 👈 aquí se manda el archivo
      }

      await updateWheelById(selectedRuleta, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("✅ Listo", "Cambios guardados con éxito", "success");
    } catch (error) {
      console.error("Error guardando cambios:", error);
      Swal.fire("❌ Error", "No se pudieron guardar los cambios", "error");
    }
  };



  return (
    <div className="d-flex justify-content-center align-items-center mt-2">
      <Row>
        <Col md={6}>
          <Row className="mb-3">
            <Col md={6}>
              {!creatingNew ? (
                <Form.Select
                  onChange={(e) => handleSelectRuleta(e.target.value)}
                  value={selectedRuleta || ""}
                >
                  <option value="">-- Selecciona Ruleta --</option>
                  {ruletas.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre}
                    </option>
                  ))}
                </Form.Select>
              ) : (

                <div>
                  <h4>🆕 Nueva Ruleta</h4>
                  <FloatingLabel
                    controlId="floatingRuletaName"
                    label="Nombre de la nueva ruleta"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Nombre de la nueva ruleta"
                      value={newRuletaName}
                      onChange={(e) => setNewRuletaName(e.target.value)}
                    />
                  </FloatingLabel>
                </div>
              )}
            </Col>

            <Col md={6} className="text-end">
              {!creatingNew && (
                <Button variant="outline-success" onClick={handleStartCreate}>
                  <FaPlus className="me-1" /> Crear nueva ruleta
                </Button>
              )}
            </Col>
          </Row>

          {(selectedRuleta || creatingNew) && (
            <>
              {!creatingNew && (

                <FloatingLabel
                  controlId="floatingEditRuletaName"
                  label="Nombre de la ruleta"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder="Nombre de la ruleta"
                    value={ruletaName}
                    onChange={(e) => setRuletaName(e.target.value)}
                  />
                </FloatingLabel>
              )}

              <Form.Check
                type="switch"
                id="active-switch"
                label="Activar ruleta"
                checked={isActive === 1}
                onChange={(e) => setIsActive(e.target.checked ? 1 : 0)}
                className="mt-3"
              />

              <h4 className="mt-4"><FaPalette color="orange" /> Colores de fondo</h4>
              <Row className="mb-3">
                {colors.map((color, idx) => (
                  <Col xs={12} className="mb-2 d-flex align-items-center" key={idx}>
                    <InputGroup>
                      <Form.Control
                        type="color"
                        value={color}
                        onChange={(e) => {
                          const newColors = [...colors];
                          newColors[idx] = e.target.value;
                          setColors(newColors);
                        }}
                      />
                      <InputGroup.Text>{color}</InputGroup.Text>
                      <Button
                        variant="outline-danger"
                        onClick={() => setColors(colors.filter((_, i) => i !== idx))}
                      >
                        <FaTimes />
                      </Button>
                    </InputGroup>
                  </Col>
                ))}
              </Row>
              <Button
                className="mb-3"
                variant="outline-primary"
                onClick={() => setColors([...colors, "#000000"])}
              >
                <FaPlus /> Agregar color
              </Button>

              <h4 className="mt-4"><FaTags color="brown" /> Ofertas</h4>
              {offers.map((offer, idx) => (
                <Form.Group className="mb-2 d-flex align-items-center" key={idx}>
                  <Form.Control
                    type="text"
                    value={offer.option}
                    onChange={(e) => {
                      const newOffers = [...offers];
                      newOffers[idx].option = e.target.value;
                      setOffers(newOffers);
                    }}
                    placeholder={`Oferta ${idx + 1}`}
                    className="me-2"
                  />
                  <Form.Select
                    value={offer.textColor}
                    onChange={(e) => {
                      const newOffers = [...offers];
                      newOffers[idx].textColor = e.target.value;
                      setOffers(newOffers);
                    }}
                    className="me-2"
                  >
                    <option value="#ffffff">Blanco</option>
                    <option value="#000000">Negro</option>
                  </Form.Select>
                  <Button
                    variant="outline-danger"
                    onClick={() => setOffers(offers.filter((_, i) => i !== idx))}
                  >
                    <FaTimes />
                  </Button>
                </Form.Group>
              ))}
              <Button
                className="mb-3"
                variant="outline-primary"
                onClick={() => setOffers([...offers, { option: "Nueva Oferta", textColor: "#ffffff" }])}
              >
                <FaPlus /> Agregar oferta
              </Button>
            </>
          )}
        </Col>

        <Col md={6} className="text-center d-flex flex-column align-items-center">
          {(selectedRuleta || creatingNew) && (
            <>
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={offers.map((o) => ({ option: o.option }))}
                backgroundColors={colors}
                textColors={offers.map((o) => o.textColor)}
                onStopSpinning={() => setMustSpin(false)}
              />
              <h4 className="mt-4"><FaImage color="blue" /> Imagen de fondo</h4>
              <div className="mb-3">
                {image && (
                  <img
                    src={typeof image === "string" ? image : URL.createObjectURL(image)}
                    alt="ruleta fondo"
                    style={{ maxWidth: "60%", borderRadius: "10px" }}
                  />
                )}
              </div>

              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />


            </>
          )}
        </Col>

        {creatingNew ? (
          <div className="d-flex mb-2">
            <Button
              className="flex-grow-1 w-50 me-2"
              onClick={() => {
                handleCreateRuleta();
                setCreatingNew(false);
              }}
            >
              <FaSave /> Guardar nueva ruleta
            </Button>
            <Button variant="danger" className="w-50" onClick={handleCancelCreate}>
              <FaTimes /> Cancelar
            </Button>
          </div>
        ) : (
          selectedRuleta && (
            <>
              <Button className="mt-3 w-100 mb-2" onClick={handleSave}>
                <FaSave /> Guardar cambios
              </Button>
              <Button variant="outline-danger" className="w-100 mb-2" onClick={handleDeleteRuleta}>
                <FaTrash /> Eliminar ruleta
              </Button>
            </>
          )
        )}
      </Row>
    </div>
  );
}
