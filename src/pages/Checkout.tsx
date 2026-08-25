import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";

import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { getAddressesByUserId } from "../api/addressApi";
import type { Address, CartItem } from "../types";

export default function Checkout() {
  const auth = useContext(AuthContext);
  const cartContext = useContext(CartContext);

  const navigate = useNavigate();
  const location = useLocation();

  if (!auth || !cartContext) {
    return null;
  }

  const { user } = auth;
  const { cart } = cartContext;

  const buyNowItem = (location.state as { buyNowItem?: CartItem })
    ?.buyNowItem;

  const itemsToCheckout: CartItem[] = buyNowItem
    ? [buyNowItem]
    : cart;

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] =
    useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: { from: "/checkout" },
      });
      return;
    }

    const loadAddresses = async () => {
      setLoading(true);

      const data = await getAddressesByUserId(user.id);

      setAddresses(data);

      if (data.length > 0) {
        setSelectedAddressId(data[0].id);
      }

      setLoading(false);
    };

    loadAddresses();
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const total = itemsToCheckout.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const handleProceed = () => {
    if (!selectedAddressId) {
      return;
    }

    navigate("/payment", {
      state: {
        addressId: selectedAddressId,
        items: itemsToCheckout,
        total,
      },
    });
  };

  if (loading) {
    return (
      <Container className="py-5">
        Loading...
      </Container>
    );
  }

  if (itemsToCheckout.length === 0) {
    return (
      <Container className="py-5">
        <Alert variant="info">
          There is nothing to checkout.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h4 className="fw-bold mb-4">
        Checkout
      </h4>

      <Row className="g-4">
        <Col lg={7}>
          <Card className="p-3 shadow-sm mb-3">
            <h6 className="fw-bold mb-3">
              Select Delivery Address
            </h6>

            {addresses.length === 0 && (
              <Alert variant="warning">
                You have no saved addresses.
                Please add one first.

                <div className="mt-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() =>
                      navigate("/addresses")
                    }
                  >
                    Add Address
                  </Button>
                </div>
              </Alert>
            )}

            {addresses.map((addr) => (
              <Form.Check
                key={addr.id}
                type="radio"
                id={`addr-${addr.id}`}
                name="address"
                className="border rounded p-2 mb-2"
                checked={
                  selectedAddressId === addr.id
                }
                onChange={() =>
                  setSelectedAddressId(addr.id)
                }
                label={
                  <div>
                    <div className="fw-semibold">
                      {addr.name}
                    </div>

                    <div className="small text-muted">
                      {addr.phone}
                    </div>

                    <div className="small">
                      {addr.address}, {addr.city},{" "}
                      {addr.state} - {addr.pincode}
                    </div>
                  </div>
                }
              />
            ))}

            <Button
              variant="outline-primary"
              size="sm"
              className="mt-2 align-self-start"
              onClick={() =>
                navigate("/addresses")
              }
            >
              Manage Addresses
            </Button>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="p-3 shadow-sm">
            <h6 className="fw-bold mb-3">
              Order Summary
            </h6>

            {itemsToCheckout.map((item) => (
              <div
                key={item.id}
                className="d-flex justify-content-between small mb-2"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>

                <span>
                  &#8377;
                  {(
                    item.price * item.quantity
                  ).toLocaleString("en-IN")}
                </span>
              </div>
            ))}

            <hr />

            <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
              <span>Total</span>

              <span>
                &#8377;
                {total.toLocaleString("en-IN")}
              </span>
            </div>

            <Button
              variant="warning"
              className="fw-semibold"
              disabled={!selectedAddressId}
              onClick={handleProceed}
            >
              Proceed to Payment
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}