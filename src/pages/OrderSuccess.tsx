import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

export default function OrderSuccess() {
  return (
    <Container className="py-5 text-center">
      <div className="order-success-icon mb-3">&#10003;</div>
      <h3 className="fw-bold">Order Successful</h3>
      <p className="text-muted">Your order has been placed successfully.</p>
      <div className="d-flex justify-content-center gap-3 mt-4">
        <Button as={Link as any} to="/order-history" variant="primary">
          Order History
        </Button>
        <Button as={Link as any} to="/products" variant="outline-primary">
          Continue Shopping
        </Button>
      </div>
    </Container>
  );
}
