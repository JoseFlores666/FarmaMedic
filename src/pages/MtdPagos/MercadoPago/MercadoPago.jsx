import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';


const MercadoPago = () => {
// Inicializa Mercado Pago con tu public key
initMercadoPago(`${import.meta.env.Public_Key}`,{
    locale:'es-MX'
});
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>Botón de Pago</h1>
      <p>Haz clic en el botón para realizar el pago.</p>
      {/* Renderiza el botón de pago */}
      <div style={{ width: '300px' }}>
        <Wallet initialization={{ preferenceId: 'YOUR_PREFERENCE_ID' }} />
      </div>
    </div>
  );
};

export default MercadoPago;
