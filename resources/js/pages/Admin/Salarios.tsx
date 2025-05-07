import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { Table, Button, Modal, Form, Alert, Spinner } from "react-bootstrap";

interface Salario {
   codemp: number;
  denominacion: string;
  salario: number | null;
  salcoordinacion: number | null;
  vigencia: number;
}

const Salarios = () => {
  const [salarios, setSalarios] = useState<Salario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newSalario, setNewSalario] = useState<Salario>({
    codemp: 0,
    denominacion: "",
    salario: 0,
    salcoordinacion: 0,
    vigencia: 0,
  });
  const [editingSalarioId, setEditingSalarioId] = useState<number | null>(null);

  useEffect(() => {
    fetchSalarios();
  }, []);

  const fetchSalarios = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/salarios");
      const data = Array.isArray(response.data) ? response.data : response.data.data ?? [];
      setSalarios(data);
    } catch (error) {
      console.error("Error cargando salarios:", error);
      setError("No se pudieron cargar los salarios.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSalario((prev) => ({
      ...prev,
      [name]: name === "salario" || name === "salcoordinacion"
        ? parseFloat(value)
        : value,
    }));
  };

  const handleAddSalario = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post("/api/salarios", newSalario);
      setShowModal(false);
      resetForm();
      fetchSalarios();
    } catch (error) {
      console.error("Error agregando salario:", error);
      setError("No se pudo agregar el salario.");
    }
  };

  const handleEditSalario = (salario: Salario) => {
    setEditingSalarioId(salario.codemp); 
    setNewSalario(salario);
    setShowModal(true);
  };

  const handleUpdateSalario = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingSalarioId !== null) {
      try {
        await api.put(`/api/salarios/${editingSalarioId}`, newSalario);
        setShowModal(false);
        resetForm();
        setEditingSalarioId(null);
        fetchSalarios();
      } catch (error) {
        console.error("Error actualizando salario:", error);
        setError("No se pudo actualizar el salario.");
      }
    }
  };

  const resetForm = () => {
    setNewSalario({
      codemp: 0,
      denominacion: "",
      salario: 0,
      salcoordinacion: 0,
      vigencia: 0,
    });
  };

  return (
    <div className="container mt-4">
      <h2>Salarios Actuales</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex justify-content-end mb-3">
        <Button variant="success" onClick={() => {
          resetForm();
          setEditingSalarioId(null);
          setShowModal(true);
        }}>
          Agregar Nuevo Salario
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Codemp</th>
              <th>Denominación</th>
              <th>Salario</th>
              <th>Salario Coordinación</th>
              <th>Vigencia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {salarios.length > 0 ? (
              salarios.map((salario) => (
                <tr key={salario.codemp}>
                  <td>{salario.codemp}</td>
                  <td>{salario.denominacion}</td>
                  <td>
                  {salario.salario !== null
                    ? Number(salario.salario).toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0,
                      maximumFractionDigits: 0 })
                    : "No disponible"}
                </td>
                <td>
                  {salario.salcoordinacion !== null
                    ? Number(salario.salcoordinacion).toLocaleString("es-CO", { style: "currency", currency: "COP",minimumFractionDigits: 0,
                      maximumFractionDigits: 0 })
                    : "No disponible"}
                </td>

                  <td>{salario.vigencia}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleEditSalario(salario)}>
                      Editar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">No hay salarios registrados.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingSalarioId ? "Editar Salario" : "Agregar Nuevo Salario"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={editingSalarioId ? handleUpdateSalario : handleAddSalario}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Codemp</Form.Label>
              <Form.Control
                type="text"
                name="codemp"
                value={newSalario.codemp}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Denominación</Form.Label>
              <Form.Control
                type="text"
                name="denominacion"
                value={newSalario.denominacion}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Salario</Form.Label>
              <Form.Control
                type="number"
                name="salario"
                value={newSalario.salario ?? ""}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Salario Coordinación</Form.Label>
              <Form.Control
                type="number"
                name="salcoordinacion"
                value={newSalario.salcoordinacion ?? ""}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Vigencia</Form.Label>
              <Form.Control
                type="text"
                name="vigencia"
                value={newSalario.vigencia}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">
              {editingSalarioId ? "Actualizar" : "Guardar"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Salarios;
