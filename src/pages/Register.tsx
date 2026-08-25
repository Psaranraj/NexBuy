import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { getUsers, registerUser } from "../api/userApi";
import { useApi } from "../hooks/useApi";
import type { User } from "../types";

export default function Register() {
  const navigate = useNavigate();

  const { loading, error: apiError, execute } = useApi();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const existingUsers = await execute(getUsers);

    if (!existingUsers) {
      return;
    }

    const emailTaken = existingUsers.some(
      (user: User) =>
        user.email.trim().toLowerCase() === email.trim().toLowerCase()
    );

    const phoneTaken = existingUsers.some(
      (user: User) => user.phone === phone.trim()
    );

    if (emailTaken || phoneTaken) {
      setError("User already exists.");
      return;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
    };

    const registeredUser = await execute(() =>
      registerUser(newUser)
    );

    if (registeredUser) {
      navigate("/login");
    }
  };

  const displayError = error || apiError;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="p-4 shadow-sm">
            <h4 className="fw-bold mb-3">
              Create your NexBuy account
            </h4>

            {displayError && (
              <Alert variant="danger">
                {displayError}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="w-100 fw-semibold"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Register"}
              </Button>
            </Form>

            <div className="text-center mt-3 small">
              Already have an account?{" "}
              <Link to="/login">Login</Link>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
