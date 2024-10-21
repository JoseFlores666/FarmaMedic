import { useState } from 'react';

export const Contact = () => {
  const [items, setItems] = useState({
    privacyPolicy: '',
    termsConditions: '',
    legalDisclaimer: '',
    userProfile: '',
  });

  const [editing, setEditing] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItems({ ...items, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      setItems({ ...items, [editing]: items[editing] });
      setEditing(null);
    } else {
      console.log('Contenido guardado:', items);
    }
  };

  const handleEdit = (field) => {
    setEditing(field);
  };

  const handleDelete = (field) => {
    setItems({ ...items, [field]: '' });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Política de Privacidad, Términos y Condiciones, Deslinde Legal y Perfil de Usuario</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h2>Política de Privacidad</h2>
          <textarea
            className="form-control"
            name="privacyPolicy"
            value={items.privacyPolicy}
            onChange={handleChange}
            placeholder="Ingresa la política de privacidad"
            rows="4"
          />
          <button type="button" className="btn btn-warning mt-2" onClick={() => handleEdit('privacyPolicy')}>Editar</button>
          <button type="button" className="btn btn-danger mt-2 ms-2" onClick={() => handleDelete('privacyPolicy')}>Eliminar</button>
        </div>

        <div className="mb-4">
          <h2>Términos y Condiciones</h2>
          <textarea
            className="form-control"
            name="termsConditions"
            value={items.termsConditions}
            onChange={handleChange}
            placeholder="Ingresa los términos y condiciones"
            rows="4"
          />
          <button type="button" className="btn btn-warning mt-2" onClick={() => handleEdit('termsConditions')}>Editar</button>
          <button type="button" className="btn btn-danger mt-2 ms-2" onClick={() => handleDelete('termsConditions')}>Eliminar</button>
        </div>

        <div className="mb-4">
          <h2>Deslinde Legal</h2>
          <textarea
            className="form-control"
            name="legalDisclaimer"
            value={items.legalDisclaimer}
            onChange={handleChange}
            placeholder="Ingresa el deslinde legal"
            rows="4"
          />
          <button type="button" className="btn btn-warning mt-2" onClick={() => handleEdit('legalDisclaimer')}>Editar</button>
          <button type="button" className="btn btn-danger mt-2 ms-2" onClick={() => handleDelete('legalDisclaimer')}>Eliminar</button>
        </div>

        <div className="mb-4">
          <h2>Perfil de Usuario</h2>
          <textarea
            className="form-control"
            name="userProfile"
            value={items.userProfile}
            onChange={handleChange}
            placeholder="Ingresa el perfil de usuario"
            rows="4"
          />
          <button type="button" className="btn btn-warning mt-2" onClick={() => handleEdit('userProfile')}>Editar</button>
          <button type="button" className="btn btn-danger mt-2 ms-2" onClick={() => handleDelete('userProfile')}>Eliminar</button>
        </div>

        <button type="submit" className="btn btn-primary">{editing ? 'Actualizar' : 'Guardar'}</button>
      </form>

      <h3 className="mt-5">Contenido Actual:</h3>
      <div className="mt-3">
        <h4>Política de Privacidad:</h4>
        <p>{items.privacyPolicy}</p>
        <h4>Términos y Condiciones:</h4>
        <p>{items.termsConditions}</p>
        <h4>Deslinde Legal:</h4>
        <p>{items.legalDisclaimer}</p>
        <h4>Perfil de Usuario:</h4>
        <p>{items.userProfile}</p>
      </div>
    </div>
  );
};
