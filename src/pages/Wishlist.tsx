import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { AuthContext } from "../context/AuthContext";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";

export default function Wishlist() {
  const auth = useContext(AuthContext);
  const wishlistContext = useContext(WishlistContext);
  const cartContext = useContext(CartContext);

  const navigate = useNavigate();

  if (!auth || !wishlistContext || !cartContext) {
    return null;
  }

  const { user } = auth;
  const { wishlist, toggleWishlist } = wishlistContext;
  const { addToCart } = cartContext;

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: { from: "/wishlist" },
      });
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  if (wishlist.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="info">
          Your wishlist is empty.
        </Alert>

        <Button
          as={Link as any}
          to="/products"
          variant="primary"
        >
          Explore Products
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h4 className="fw-bold mb-4">
        Your Wishlist
      </h4>

      <Row className="g-3">
        {wishlist.map((product) => (
          <Col
            key={product.id}
            xs={6}
            md={4}
            lg={3}
          >
            <Card className="h-100 shadow-sm">
              <Link to={`/products/${product.id}`}>
                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.name}
                />
              </Link>

              <Card.Body>
                <div className="text-muted small">
                  {product.brand}
                </div>

                <Card.Title className="fs-6">
                  {product.name}
                </Card.Title>

                <div className="fw-bold mb-2">
                  &#8377;
                  {product.price.toLocaleString("en-IN")}
                </div>

                <div className="d-grid gap-2">
                  <Button
                    size="sm"
                    variant="warning"
                    className="fw-semibold"
                    onClick={() => {
                      addToCart(product);
                    }}
                  >
                    Move to Cart
                  </Button>

                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => {
                      toggleWishlist(product);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}