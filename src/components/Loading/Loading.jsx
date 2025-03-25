import { PulseLoader } from 'react-spinners';
import PropTypes from 'prop-types';

const Loader = ({ loading }) => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      {loading && <PulseLoader size={40} color="#36D7B7" loading={loading} />}
    </div>
  );
};

Loader.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default Loader;
