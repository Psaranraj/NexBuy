import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";

import { AuthContext } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";

import {
  getAddressesByUserId,
  createAddress,
  updateAddress,
} from "../api/addressApi";

import type { Address, CartItem, NewAddress } from "../types";

const emptyForm: Omit<NewAddress, "userId"> = {
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

type NavigationState = {
  from?: string;
  buyNowItem?: CartItem;
};

export default function Addresses() {
  const auth = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const user = auth?.user;

  const navigationState = location.state as NavigationState | null;

  const [addresses, setAddresses] = useState<Address[]>([]);

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState(emptyForm);

  const {
    loading: loadingList,
    error: listError,
    execute: executeLoad,
  } = useApi();

  const { loading: saving, error: saveError, execute: executeSave } = useApi();

  const loadAddresses = async (userId: string) => {
    const data = await executeLoad(() => getAddressesByUserId(userId));

    if (data) {
      setAddresses(data);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: {
          from: "/addresses",
        },
        replace: true,
      });

      return;
    }

    loadAddresses(user.id);
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingId(addr.id);

    setForm({
      name: addr.name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });

    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEditing = Boolean(editingId);

    const payload: NewAddress = {
      ...form,
      userId: user.id,
    };

    const result = editingId
      ? await executeSave(() => updateAddress(editingId, payload))
      : await executeSave(() => createAddress(payload));

    if (!result) {
      return;
    }

    await loadAddresses(user.id);

    setShowModal(false);

    if (!isEditing && navigationState?.from) {
      navigate(navigationState.from, {
        state: {
          buyNowItem: navigationState.buyNowItem,
        },
        replace: true,
      });
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Your Addresses</h4>

        <Button variant="primary" onClick={openAddModal}>
          Add New Address
        </Button>
      </div>

      {listError && <Alert variant="danger">{listError}</Alert>}

      {loadingList && <div>Loading...</div>}

      {!loadingList && addresses.length === 0 && (
        <Alert variant="info">You have no saved addresses yet.</Alert>
      )}

      <Row className="g-3">
        {addresses.map((addr) => (
          <Col md={6} key={addr.id}>
            <Card className="p-3 shadow-sm">
              <div className="fw-semibold">{addr.name}</div>

              <div className="small text-muted">{addr.phone}</div>

              <div className="small mt-1">
                {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
              </div>

              <Button
                size="sm"
                variant="outline-primary"
                className="mt-2 align-self-start"
                onClick={() => openEditModal(addr)}
              >
                Edit
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? "Edit Address" : "Add Address"}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {saveError && <Alert variant="danger">{saveError}</Alert>}

            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>

              <Form.Control
                required
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>

              <Form.Control
                required
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>

              <Form.Control
                required
                value={form.address}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>City</Form.Label>

                  <Form.Control
                    required
                    value={form.city}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        city: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>State</Form.Label>

                  <Form.Control
                    required
                    value={form.state}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        state: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-2">
              <Form.Label>Pincode</Form.Label>

              <Form.Control
                required
                value={form.pincode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pincode: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>

            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Address"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
