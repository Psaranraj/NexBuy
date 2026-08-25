import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Alert from "react-bootstrap/Alert";
import { useFetch } from "../hooks/useFetch";
import { getOrderById } from "../api/orderApi";
import Loading from "../components/Loading";
import type { Order } from "../types";

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();

  const {
    data: order,
    loading,
    error,
  } = useFetch<Order>(() => getOrderById(id as string), [id]);

  if (loading) return <Loading />;

  if (error || !order) {
    return (
      <Container className="py-4">
        <Alert variant="danger">Order not found.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h4 className="fw-bold mb-1">Order #{order.id}</h4>
      <div className="text-muted small mb-4">
        Placed on {new Date(order.createdAt).toLocaleString("en-IN")}
      </div>

      <Row className="g-4">
        <Col lg={7}>
          <Card className="p-3 shadow-sm">
            <h6 className="fw-bold mb-3">Products</h6>
            {order.cart.map((item) => (
              <Row key={item.id} className="align-items-center mb-3">
                <Col xs={3} md={2}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="img-fluid rounded"
                  />
                </Col>
                <Col xs={9} md={6}>
                  <div className="fw-semibold">{item.name}</div>
                  <div className="small text-muted">
                    Qty: {item.quantity}
                  </div>
                </Col>
                <Col xs={12} md={4} className="text-md-end">
                  &#8377;{(item.price * item.quantity).toLocaleString("en-IN")}
                </Col>
              </Row>
            ))}
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>Total</span>
              <span>&#8377;{order.total.toLocaleString("en-IN")}</span>
            </div>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="p-3 shadow-sm mb-3">
            <h6 className="fw-bold mb-2">Order Status</h6>
            <Badge bg="primary">{order.status}</Badge>
          </Card>
          <Card className="p-3 shadow-sm mb-3">
            <h6 className="fw-bold mb-2">Payment Method</h6>
            <div>{order.paymentMethod}</div>
          </Card>
          <Card className="p-3 shadow-sm">
            <h6 className="fw-bold mb-2">Delivery Address</h6>
            <div className="fw-semibold">{order.deliveryAddress.name}</div>
            <div className="small text-muted">{order.deliveryAddress.phone}</div>
            <div className="small">
              {order.deliveryAddress.address}, {order.deliveryAddress.city},{" "}
              {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
