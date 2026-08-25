import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const auth = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo =
    (location.state as { from?: string })?.from ?? "/";

  if (!auth) {
    return null;
  }

  const { login } = auth;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    const success = await login(identifier, password);

    setSubmitting(false);

    if (success) {
      navigate(redirectTo);
    } else {
      setError("Invalid email/phone or password.");
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="p-4 shadow-sm">
            <h4 className="fw-bold mb-3">Login to NexBuy</h4>

            {error && (
              <Alert variant="danger">{error}</Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Email or Phone Number
                </Form.Label>

                <Form.Control
                  type="text"
                  value={identifier}
                  onChange={(e) =>
                    setIdentifier(e.target.value)
                  }
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>

                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="w-100 fw-semibold"
                disabled={submitting}
              >
                {submitting
                  ? "Logging in..."
                  : "Login"}
              </Button>
            </Form>

            <div className="text-center mt-3 small">
              New to NexBuy?{" "}
              <Link to="/register">
                Create an account
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}