import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import type { Product } from "../types";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import { useAuth } from "../hooks/useAuth";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();

  const inWishlist = isInWishlist(product.id);

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) /
            product.originalPrice) *
            100
        )
      : null;

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    addToCart(product);
  };

  const handleWishlistClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    toggleWishlist(product);
  };

  return (
    <Card
      className="product-card h-100 shadow-sm"
      onClick={handleCardClick}
      role="button"
    >
      <button
        className="wishlist-btn"
        onClick={handleWishlistClick}
        aria-label="Toggle wishlist"
        type="button"
      >
        {inWishlist ? "❤️" : "🤍"}
      </button>

      <div className="product-card-img-wrap">
        <Card.Img
          variant="top"
          src={product.image}
          alt={product.name}
          onError={(e) => {
            console.error("Image failed:", product.image);
            e.currentTarget.src = "/products/product_01.jpg";
          }}
        />
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="text-muted small mb-1">
          {product.brand}
        </div>

        <Card.Title className="product-card-title">
          {product.name}
        </Card.Title>

        <div className="mb-2">
          <span className="text-warning">★</span>{" "}
          <span className="fw-semibold">{product.rating}</span>
        </div>

        <div className="mt-auto">
          <div className="d-flex align-items-baseline gap-2 mb-2">
            <span className="fw-bold fs-5">
              ₹{product.price.toLocaleString("en-IN")}
            </span>

            {product.originalPrice && (
              <span className="text-muted text-decoration-line-through small">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}

            {discount && (
              <span className="text-success small fw-semibold">
                {discount}% off
              </span>
            )}
          </div>

          <Button
            variant="warning"
            className="w-100 fw-semibold"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}