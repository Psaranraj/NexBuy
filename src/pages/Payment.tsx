import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useApi } from "../hooks/useApi";

import { getAddressesByUserId } from "../api/addressApi";

import { createOrder } from "../api/orderApi";

import type { CartItem, Order } from "../types";

type CheckoutState = {
  userId: string;
  addressId: string;
  items: CartItem[];
  total: number;
};

const paymentMethods = [
  {
    label: "UPI",
    value: "UPI",
  },
  {
    label: "Credit / Debit Card",
    value: "Card",
  },
  {
    label: "Net Banking",
    value: "Net Banking",
  },
  {
    label: "Cash on Delivery",
    value: "Cash on Delivery",
  },
];

const CHECKOUT_STORAGE_KEY = "nexbuy_checkout";

export default function Payment() {
  const auth = useContext(AuthContext);

  const cartContext = useContext(CartContext);

  const navigate = useNavigate();

  const user = auth?.user;

  const removePurchasedItems = cartContext?.removePurchasedItems;

  const { loading, error, execute } = useApi();

  const {
    loading: loadingAddress,
    error: addressError,
    execute: executeAddress,
  } = useApi();

  const [method, setMethod] = useState("UPI");

  const [checkoutState, setCheckoutState] = useState<CheckoutState | null>(
    null,
  );

  useEffect(() => {
    const savedCheckout = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);

    if (!savedCheckout) {
      setCheckoutState(null);
      return;
    }

    try {
      const parsedState = JSON.parse(savedCheckout) as CheckoutState;

      setCheckoutState(parsedState);
    } catch {
      sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);

      setCheckoutState(null);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: {
          from: "/payment",
        },
        replace: true,
      });

      return;
    }

    if (
      checkoutState &&
      (checkoutState.userId !== user.id ||
        checkoutState.items.length === 0 ||
        !checkoutState.addressId ||
        checkoutState.total <= 0)
    ) {
      sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);

      navigate("/cart", {
        replace: true,
      });
    }
  }, [user, checkoutState, navigate]);

  if (!user || !checkoutState || !removePurchasedItems) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          No valid checkout information found. Please start from your cart.
        </Alert>

        <Button variant="primary" onClick={() => navigate("/cart")}>
          Go to Cart
        </Button>
      </Container>
    );
  }

  const handlePay = async () => {
    const addresses = await executeAddress(() => getAddressesByUserId(user.id));

    if (!addresses) {
      return;
    }

    const deliveryAddress = addresses.find(
      (address) => address.id === checkoutState.addressId,
    );

    if (!deliveryAddress) {
      return;
    }

    const newOrder: Omit<Order, "id"> = {
      userId: user.id,
      cart: checkoutState.items,
      total: checkoutState.total,
      paymentMethod: method,
      status: "Confirmed",
      deliveryAddress,
      createdAt: new Date().toISOString(),
    };

    const result = await execute(() => createOrder(newOrder));

    if (!result) {
      return;
    }

    removePurchasedItems(checkoutState.items);

    sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);

    navigate(`/order-success?orderId=${result.id}`, {
      replace: true,
    });
  };

  return (
    <Container className="py-4">
      <h4 className="fw-bold mb-4">Payment</h4>

      {(error || addressError) && (
        <Alert variant="danger">{error || addressError}</Alert>
      )}

      <Row className="g-4">
        <Col lg={7}>
          <Card className="p-3 shadow-sm">
            <h6 className="fw-bold mb-3">Select Payment Method</h6>

            {paymentMethods.map((pm) => (
              <Form.Check
                key={pm.value}
                type="radio"
                id={`pm-${pm.value}`}
                name="payment"
                label={pm.label}
                className="mb-2"
                checked={method === pm.value}
                onChange={() => setMethod(pm.value)}
              />
            ))}

            <Alert variant="secondary" className="small mt-3 mb-0">
              This is a demo checkout. No real payment gateway is used.
            </Alert>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="p-3 shadow-sm">
            <h6 className="fw-bold mb-3">Amount Payable</h6>

            <div className="fw-bold fs-4 mb-3">
              &#8377;
              {checkoutState.total.toLocaleString("en-IN")}
            </div>

            <Button
              variant="warning"
              className="fw-semibold"
              disabled={loading || loadingAddress}
              onClick={handlePay}
            >
              {loading || loadingAddress ? "Processing..." : "Pay Now"}
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
