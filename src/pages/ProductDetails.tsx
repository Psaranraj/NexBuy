import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { getProductById } from "../api/productApi";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import { useAuth } from "../hooks/useAuth";
import Loading from "../components/Loading";

import type {
  Product,
  ProductVariant,
} from "../types";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } =
    useWishlist();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(id);

        setProduct(data);

        if (
          data.variants &&
          data.variants.length > 0
        ) {
          setSelectedVariant(data.variants[0]);
        }
      } catch {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Product not found.
        </Alert>
      </Container>
    );
  }

  const currentPrice =
    selectedVariant?.price ?? product.price;

  const currentOriginalPrice =
    selectedVariant?.originalPrice ??
    product.originalPrice;

  const discount =
    currentOriginalPrice &&
    currentOriginalPrice > currentPrice
      ? Math.round(
          ((currentOriginalPrice - currentPrice) /
            currentOriginalPrice) *
            100
        )
      : 0;

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login", {
        state: {
          from: `/products/${product.id}`,
        },
      });

      return;
    }

    addToCart({
      ...product,
      price: currentPrice,
      originalPrice: currentOriginalPrice,
      selectedVariant:
        selectedVariant ?? undefined,
    });
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate("/login", {
        state: {
          from: `/products/${product.id}`,
        },
      });

      return;
    }

    addToCart({
      ...product,
      price: currentPrice,
      originalPrice: currentOriginalPrice,
      selectedVariant:
        selectedVariant ?? undefined,
    });

    navigate("/checkout");
  };

  return (
    <Container className="py-4">
      <Row className="g-4">
        {/* Product Image */}
        <Col lg={5}>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex justify-content-center align-items-center">
              <Card.Img
                src={product.image}
                alt={product.name}
                className="img-fluid"
              />
            </Card.Body>
          </Card>
        </Col>

        {/* Product Details */}
        <Col lg={7}>
          <div className="text-muted mb-1">
            {product.brand}
          </div>

          <h2 className="fw-bold mb-3">
            {product.name}
          </h2>

          <div className="mb-3">
            <span className="text-warning">
              ★
            </span>{" "}
            <span className="fw-semibold">
              {product.rating}
            </span>
          </div>

          {/* Selected Variant */}
          {selectedVariant && (
            <h5 className="mb-3">
              <strong>Variant:</strong>{" "}
              {selectedVariant.name}
            </h5>
          )}

          {/* Variant Cards */}
          {product.variants &&
            product.variants.length > 0 && (
              <div className="mb-4">
                <h5 className="fw-bold mb-3">
                  Select Variant
                </h5>

                <Row className="g-2">
                  {product.variants.map(
                    (variant) => {
                      const variantDiscount =
                        Math.round(
                          ((variant.originalPrice -
                            variant.price) /
                            variant.originalPrice) *
                            100
                        );

                      const isSelected =
                        selectedVariant?.id ===
                        variant.id;

                      return (
                        <Col
                          xs={12}
                          sm={6}
                          md={4}
                          key={variant.id}
                        >
                          <Card
                            className={`h-100 ${
                              isSelected
                                ? "border-dark border-2"
                                : "border"
                            }`}
                            role="button"
                            onClick={() =>
                              setSelectedVariant(
                                variant
                              )
                            }
                          >
                            <Card.Body className="p-3">
                              {/* Variant Name */}
                              <Card.Title className="fs-6 fw-semibold">
                                {variant.name}
                              </Card.Title>

                              {/* Discount */}
                              <div className="text-success fw-bold">
                                ↓{variantDiscount}%
                              </div>

                              {/* Price */}
                              <div className="fw-bold fs-5">
                                ₹
                                {variant.price.toLocaleString(
                                  "en-IN"
                                )}
                              </div>

                              {/* Original Price */}
                              <div className="text-muted text-decoration-line-through small">
                                ₹
                                {variant.originalPrice.toLocaleString(
                                  "en-IN"
                                )}
                              </div>

                              {/* Stock */}
                              <div
                                className={
                                  variant.stock <= 3
                                    ? "text-danger small mt-2"
                                    : "text-success small mt-2"
                                }
                              >
                                {variant.stock <= 3
                                  ? `Only ${variant.stock} left`
                                  : `${variant.stock} in stock`}
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    }
                  )}
                </Row>
              </div>
            )}

          {/* Product Price */}
          <div className="mb-4">
            <span className="fw-bold fs-2">
              ₹
              {currentPrice.toLocaleString(
                "en-IN"
              )}
            </span>

            {currentOriginalPrice && (
              <span className="text-muted text-decoration-line-through ms-3">
                ₹
                {currentOriginalPrice.toLocaleString(
                  "en-IN"
                )}
              </span>
            )}

            {discount > 0 && (
              <span className="text-success fw-semibold ms-2">
                {discount}% off
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-muted">
            {product.description}
          </p>

          {/* Buttons */}
          <div className="d-flex gap-3 flex-wrap">
            <Button
              variant="warning"
              size="lg"
              className="fw-semibold"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>

            <Button
              variant="primary"
              size="lg"
              className="fw-semibold"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>

            <Button
              variant="outline-danger"
              size="lg"
              onClick={() =>
                toggleWishlist(product)
              }
            >
              {isInWishlist(product.id)
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}