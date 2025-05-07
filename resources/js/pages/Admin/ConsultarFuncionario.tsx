import React, { useState } from 'react';
import axios from '../../api/axios';
import { Table, Form, Button, Container, Alert, Spinner } from 'react-bootstrap';

interface Adscrito {
  id: number;
  nombre: string;
}



interface Empleo {
  id: number;
  codemp: string;
  adscrito: Adscrito | null;
  fecha_ingreso: string;
  fecha_final: string | null;
  coordinador: boolean;
  salario?: number;
  salcoordinacion?: number;
  denominacion?:string;
  
}

interface Funcionario {
  identificacion: string;
  nombres: string;
  apellidos: string;
  email: string;
  empleos: Empleo[];
}

const ConsultarFuncionario: React.FC = () => {
  const [identificacion, setIdentificacion] = useState('');
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const buscarFuncionario = async () => {
    if (!identificacion.trim()) {
      setError('🚫 La identificación no puede estar vacía.');
      return;
    }

    setLoading(true);
    setError('');
    setFuncionario(null);

    try {
      const response = await axios.get(`/api/funcionarios/${identificacion}/empleos`);
      setFuncionario(response.data);
    } catch (error) {
      setError('🚫 No se encontró el funcionario o hubo un error en la búsqueda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">🔎 Consulta de Funcionario</h2>

      <Form className="mb-4 d-flex gap-2 justify-content-center">
        <Form.Control
          type="text"
          placeholder="Ingrese la identificación..."
          value={identificacion}
          onChange={(e) => setIdentificacion(e.target.value)}
          className="w-50 shadow-sm"
        />
        <Button variant="primary" onClick={buscarFuncionario} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Buscar'}
        </Button>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      {funcionario && (
        <div>
          <Alert variant="success">
            👤 <strong>{funcionario.nombres} {funcionario.apellidos}</strong><br />
            📧 <small>{funcionario.email}</small>
          </Alert>

          <h5 className="mb-3">📋 Lista de empleos:</h5>
          <Table striped bordered hover responsive className="shadow-sm rounded">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>🏷️ Código</th>
                <th>🏢 Adscrito A</th>
                <th>👨🏻‍🔧 Cargo</th>
                <th>📅 Fecha inicio</th>
                <th>📅 Fecha final</th>              
                <th>🧑‍🏫 Coordinador</th>
              </tr>
            </thead>
            <tbody>
              {funcionario.empleos.map((empleo, index) => (
                <tr key={empleo.id}>
                  <td>{index + 1}</td>
                  <td>{empleo.codemp}</td>
                  <td>{empleo.adscrito?.nombre || 'No asignado'}</td>
                <td>
                  {empleo.salario
                    ?String(empleo.salario?.denominacion)
                    : "No disponible"}
                </td>

                  <td>{empleo.fecha_ingreso ? new Date(empleo.fecha_ingreso).toLocaleDateString('es-CO') : 'Fecha no disponible'}</td>
                  <td>{empleo.fecha_final ? new Date(empleo.fecha_final).toLocaleDateString('es-CO') : '⏳ En curso'}</td>
                  
                  <td>{empleo.coordinador ? '✅ Sí' : '❌ No'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default ConsultarFuncionario;
