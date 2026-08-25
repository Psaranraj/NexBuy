import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const auth = useContext(AuthContext);
  const cartContext = useContext(CartContext);

  const navigate = useNavigate();

  const user = auth?.user ?? null;

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: { from: "/cart" },
      });
    }
  }, [user, navigate]);

  if (!auth || !cartContext || !user) {
    return null;
  }

  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } =
    cartContext;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="info">Your cart is empty.</Alert>

        <Button as={Link as any} to="/products" variant="primary">
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h4 className="fw-bold mb-4">Your Cart</h4>

      <Row className="g-4">
        <Col lg={8}>
          {cart.map((item) => (
            <Card key={item.id} className="mb-3 p-3 shadow-sm">
              <Row className="align-items-center">
                <Col xs={3} md={2}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="img-fluid rounded"
                  />
                </Col>

                <Col xs={9} md={5}>
                  <div className="fw-semibold">{item.name}</div>

                  <div className="text-muted small">{item.brand}</div>

                  <div className="fw-bold mt-1">
                    &#8377;
                    {item.price.toLocaleString("en-IN")}
                  </div>
                </Col>

                <Col xs={7} md={3} className="mt-2 mt-md-0">
                  <div className="d-flex align-items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      -
                    </Button>

                    <span>{item.quantity}</span>

                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => increaseQuantity(item.id)}
                    >
                      +
                    </Button>
                  </div>
                </Col>

                <Col xs={5} md={2} className="text-end mt-2 mt-md-0">
                  <Button
                    size="sm"
                    variant="link"
                    className="text-danger"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            </Card>
          ))}

          <Button as={Link as any} to="/products" variant="outline-primary">
            Continue Shopping
          </Button>
        </Col>

        <Col lg={4}>
          <Card className="p-3 shadow-sm">
            <h6 className="fw-bold mb-3">Order Summary</h6>

            <div className="d-flex justify-content-between mb-2">
              <span>Total Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
              <span>Total Amount</span>

              <span>
                &#8377;
                {total.toLocaleString("en-IN")}
              </span>
            </div>

            <Button
              variant="warning"
              className="fw-semibold"
              onClick={() => navigate("/checkout")}
            >
              Checkout
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
