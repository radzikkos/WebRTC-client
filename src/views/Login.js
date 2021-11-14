import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../css/Login.css";
import { useNavigate } from "react-router-dom";
import auth from "../auth";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    return email.length > 0 && password.length > 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      email,
      password,
    };
    auth.login(
      data,
      () => {
        navigate("/home");
      },
      () => {
        alert("Try again");
      }
    );
  };

  return (
    <div className="Login">
      <div className="h1 d-flex justify-content-center">Sign in</div>
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
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
          Login
        </Button>
      </Form>
    </div>
  );
};
