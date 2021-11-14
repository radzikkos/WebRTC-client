import axios from "axios";
class Auth {
  async login(data, next, errNext) {
    try {
      const result = await axios.post("user/login", data);
      localStorage.setItem("token", result.data.token);
      // localStorage.setItem("user", result.data.user);
      localStorage.setItem("id", result.data.user.id);
      localStorage.setItem("firstname", result.data.user.firstname);
      localStorage.setItem("lastname", result.data.user.lastname);
      localStorage.setItem("email", result.data.user.email);
      next();
    } catch (err) {
      errNext();
    }
  }
  async isAuthenticated() {
    try {
      const result = await axios.get("user/" + localStorage.getItem("token"));
      return result.data;
    } catch (err) {
      return false;
    }
  }
  logout(next) {
    localStorage.clear();
    next();
  }
}
export default new Auth();
