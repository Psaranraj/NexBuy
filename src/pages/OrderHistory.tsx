import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

import { AuthContext } from "../context/AuthContext";
import { getOrdersByUserId } from "../api/orderApi";
import Loading from "../components/Loading";
import type { Order } from "../types";

const statusVariant: Record<string, string> = {
  Confirmed: "primary",
  Processing: "info",
  Shipped: "warning",
  "Out for Delivery": "warning",
  Delivered: "success",
  Cancelled: "danger",
};

export default function OrderHistory() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = auth?.user ?? null;

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: { from: "/order-history" },
      });
      return;
    }

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOrdersByUserId(user.id);
        setOrders(data);
      } catch {
        setError("Failed to load order history.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user, navigate]);

  if (!auth || !user) {
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Container className="py-4">
      <h4 className="fw-bold mb-4">
        Order History
      </h4>

      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {!error && orders.length === 0 && (
        <Alert variant="info">
          You have not placed any orders yet.
        </Alert>
      )}

      {orders.map((order) => (
        <Card
          key={order.id}
          className="shadow-sm mb-4"
        >
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
              <div>
                <div className="fw-bold">
                  Order #{order.id}
                </div>

                <div className="small text-muted">
                  Ordered on{" "}
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString("en-IN")}
                </div>
              </div>

              <div className="text-end">
                <Badge
                  bg={
                    statusVariant[order.status] ??
                    "secondary"
                  }
                >
                  {order.status}
                </Badge>
              </div>
            </div>

            <hr />

            {order.cart.map((product) => (
              <Row
                key={product.id}
                className="align-items-center py-2 border-bottom"
              >
                <Col xs={3} md={2}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="img-fluid"
                    style={{
                      maxHeight: "100px",
                      objectFit: "contain",
                    }}
                  />
                </Col>

                <Col xs={9} md={6}>
                  <div className="fw-semibold">
                    {product.name}
                  </div>

                  <div className="small text-muted">
                    {product.brand}
                  </div>

                  <div className="small mt-1">
                    Quantity: {product.quantity}
                  </div>
                </Col>

                <Col
                  xs={12}
                  md={4}
                  className="text-md-end mt-2 mt-md-0"
                >
                  <div className="fw-bold">
                    &#8377;
                    {(
                      product.price * product.quantity
                    ).toLocaleString("en-IN")}
                  </div>

                  <div className="small text-muted">
                    &#8377;
                    {product.price.toLocaleString("en-IN")}{" "}
                    each
                  </div>
                </Col>
              </Row>
            ))}

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 pt-3">
              <div className="small">
                Payment:{" "}
                <span className="fw-semibold">
                  {order.paymentMethod}
                </span>
              </div>

              <div className="fw-bold fs-5">
                Total: &#8377;
                {order.total.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="mt-3">
              <Button
                as={Link as any}
                to={`/orders/${order.id}`}
                size="sm"
                variant="outline-primary"
              >
                View Details
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}