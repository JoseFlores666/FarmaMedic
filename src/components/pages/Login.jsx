import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hook/useForm';
import { useAuth } from '../../context/useAuth';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { username, password, onInputChange, onResetForm } = useForm({
    username: '',
    password: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      login(username);
      navigate('/home', { replace: true });
      onResetForm();
    } catch (err) {
      console.error('Login error:', err.message);
      alert(err.message);
    }
  };

  return (
    <div className="container py-4 h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col col-xl-10">
          <div className="card" style={{ borderRadius: '1rem' }}>
            <div className="row g-0">
              <div className="col-md-6 col-lg-5 d-none d-md-block">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                  alt="login form"
                  className="img-fluid"
                  style={{ borderRadius: '1rem 0 0 1rem' }}
                />
              </div>
              <div className="col-md-6 col-lg-7 d-flex align-items-center">
                <div className="card-body p-4 p-lg-5 text-black">

                  <form onSubmit={handleLogin}>

                    <div className="d-flex align-items-center mb-3 pb-1">
                      <i className="fas fa-cubes fa-2x me-3" style={{ color: '#ff6219' }}></i>
                      <span className="h1 fw-bold mb-0">Logo</span>
                    </div>

                    <h5 className="fw-normal  pb-1" >Sign into your account</h5>

                    <div className="form-outline ">
                      <label className="form-label" htmlFor="">Email address</label>

                      <input
                        type="text"
                        id="form2Example17"
                        className="form-control form-control-lg"
                        name="username"
                        value={username}
                        onChange={onInputChange}
                        required
                      />
                    </div>

                    <div className="form-outline mb-3">
                      <label className="form-label" htmlFor="">Password</label>

                      <input
                        type="password"
                        id="form2Example27"
                        className="form-control form-control-lg"
                        name="password"
                        value={password}
                        onChange={onInputChange}
                        required
                      />
                    </div>

                    <div className=" ">
                      <button
                        data-mdb-button-init
                        data-mdb-ripple-init
                        className="btn btn-dark btn-lg btn-block"
                        type="submit"
                      >
                        Login
                      </button>
                    </div>

                    <a className="small text-muted" href="#!">Forgot password?</a>
                    <p className=" pb-lg-2" style={{ color: '#393f81' }}>
                      Dont have an account? <a href="#!" style={{ color: '#393f81' }}>Register here</a>
                    </p>
                    <a href="#!" className="small text-muted">Terms of use.</a>
                    <a href="#!" className="small text-muted">Privacy policy</a>
                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
