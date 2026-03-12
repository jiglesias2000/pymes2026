const getUsuarioLogueado = () => {
  return sessionStorage.getItem("usuarioLogueado");
};

const AuthService = {
  getUsuarioLogueado,
};

export default AuthService;
