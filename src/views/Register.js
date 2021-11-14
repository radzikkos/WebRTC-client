import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../css/Login.css";
import axios from "axios";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastName] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    return email.length > 0 && password.length > 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      firstname,
      lastname,
      email,
      password,
    };
    try {
      const result = await axios.post("user", data);
      alert(result.data.msg);
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Sth went wrong");
    }
  };
  return (
    <div className="Login">
      <div className="h1 d-flex justify-content-center">Sign up</div>
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="firstname">
          <Form.Label>First name</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="lastname">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button
          block="true"
          size="lg"
          type="submit"
          disabled={!validateForm()}
          className="mt-2"
        >
          Register
        </Button>
      </Form>
    </div>
  );
};
