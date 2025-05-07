import { useState } from 'react';
import api from '@/api/axios';
import { Button, Form, Table, Alert } from 'react-bootstrap';

interface Empleo {
  id: number;
  codemp: string;
  opec?: string;
  vinculo?: string;
  adscrito_id: number;
  resnombramiento?: string;
  acta?: string;
  resfunciones?: string;
  fecha_ingreso: string;
  fecha_final: string | null;
  coordinador?: string;
}

interface Funcionario {
  identificacion: string;
  nombres: string;
  apellidos: string;
  email: string;
  empleos: Empleo[];
}

export default function ActualizarFuncionarioEmpleo() {
  const [identificacion, setIdentificacion] = useState('');
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [nuevoEmpleo, setNuevoEmpleo] = useState<Partial<Empleo>>({});
  const [fechaFinalEmpleoActual, setFechaFinalEmpleoActual] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [errores, setErrores] = useState<any>(null);

  const buscarFuncionario = async () => {
    try {
      const response = await api.get(`/api/funcionarios/${identificacion}/empleos`);
      setFuncionario(response.data);
      setMensaje(null);
      setErrores(null);
    } catch (error) {
      setFuncionario(null);
      setMensaje('Funcionario no encontrado.');
    }
  };

  const actualizarYRegistrarEmpleo = async () => {
    const empleoActual = funcionario?.empleos.find(e => e.fecha_final === null);

    if (empleoActual && !fechaFinalEmpleoActual) {
      setMensaje('Debe ingresar la fecha final del empleo actual antes de continuar.');
      return;
    }

    try {
      const payload = {
        funcionario: {
          identificacion: funcionario?.identificacion,
          nombres: funcionario?.nombres,
          apellidos: funcionario?.apellidos,
          email: funcionario?.email,
        },
        nuevo_empleo: nuevoEmpleo,
        cerrar_empleo_actual: empleoActual ? {
          id: empleoActual.id,
          fecha_final: fechaFinalEmpleoActual
        } : null
      };

      const response = await api.post('/api/funcionarios/actualizar-empleo', payload);
      setFuncionario(response.data.funcionario);
      setMensaje(response.data.message);
      setErrores(null);
      setNuevoEmpleo({});
      setFechaFinalEmpleoActual('');
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrores(error.response.data.errors);
      } else {
        setMensaje('Ocurrió un error al actualizar.');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Actualizar Funcionario y Registrar Nuevo Empleo</h2>

      {/* Buscar funcionario */}
      <Form className="mb-3">
        <Form.Label>Identificación</Form.Label>
        <div className="d-flex gap-2">
          <Form.Control
            type="text"
            value={identificacion}
            onChange={(e) => setIdentificacion(e.target.value)}
          />
          <Button variant="primary" onClick={buscarFuncionario}>
            Buscar
          </Button>
        </div>
      </Form>

      {/* Mensajes */}
      {mensaje && <Alert variant="info">{mensaje}</Alert>}
      {errores && (
        <Alert variant="danger">
          <ul>
            {Object.entries(errores).map(([campo, msgs]) => (
              <li key={campo}>{(msgs as string[]).join(', ')}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Datos del funcionario y tabla de empleos */}
      {funcionario && (
        <>
          <h4 className="mt-4">Datos del Funcionario</h4>
          <p><strong>Nombre:</strong> {funcionario.nombres} {funcionario.apellidos}</p>
          <p><strong>Email:</strong> {funcionario.email}</p>

          <h5>Historial de Empleos</h5>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Código</th>
                <th>Adscrito ID</th>
                <th>Ingreso</th>
                <th>Final</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {funcionario.empleos.map((e) => (
                <tr key={e.id}>
                  <td>{e.codemp}</td>
                  <td>{e.adscrito_id}</td>
                  <td>{e.fecha_ingreso}</td>
                  <td>{e.fecha_final || 'Actual'}</td>
                  <td>
                    {!e.fecha_final && (
                      <>
                        <Form.Control
                          type="date"
                          value={fechaFinalEmpleoActual}
                          onChange={(ev) => setFechaFinalEmpleoActual(ev.target.value)}
                          required
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Formulario de nuevo empleo */}
          <h5 className="mt-4">Nuevo Empleo</h5>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Código Empleo (codemp)</Form.Label>
              <Form.Control
                type="text"
                value={nuevoEmpleo.codemp || ''}
                onChange={(e) => setNuevoEmpleo({ ...nuevoEmpleo, codemp: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Adscrito ID</Form.Label>
              <Form.Control
                type="number"
                value={nuevoEmpleo.adscrito_id || ''}
                onChange={(e) =>
                  setNuevoEmpleo({ ...nuevoEmpleo, adscrito_id: parseInt(e.target.value) })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Fecha Ingreso</Form.Label>
              <Form.Control
                type="date"
                value={nuevoEmpleo.fecha_ingreso || ''}
                onChange={(e) =>
                  setNuevoEmpleo({ ...nuevoEmpleo, fecha_ingreso: e.target.value })
                }
              />
            </Form.Group>

            <Button onClick={actualizarYRegistrarEmpleo} className="mt-2">
              Guardar Nuevo Empleo
            </Button>
          </Form>
        </>
      )}
    </div>
  );
}
