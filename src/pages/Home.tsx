import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useFetch } from "../hooks/useFetch";
import { getProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import type { Product } from "../types";

const sidebarCategories = [
  "Mobiles",
  "Laptops",
  "Tablets",
  "Accessories",
  "Smart Watches",
  "Headphones",
  "Power Banks",
  "Backpacks",
];

const banners = [
  {
    title: "Big Savings on Mobiles",
    category: "Mobiles",
    startingPrice: "8,999",
    offer: "Up to 40% off",
    color: "banner-blue",
  },
  {
    title: "Best Deals on Laptops",
    category: "Laptops",
    startingPrice: "41,999",
    offer: "Up to 25% off",
    color: "banner-purple",
  },
  {
    title: "Powerful Tablets for Work & Play",
    category: "Tablets",
    startingPrice: "13,999",
    offer: "Up to 20% off",
    color: "banner-teal",
  },
];

function ProductSection({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="mb-4">
      <Card className="p-3 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">{title}</h5>
          <Button
            as={Link as any}
            to={`/products?category=${encodeURIComponent(
              products[0].category
            )}`}
            variant="outline-primary"
            size="sm"
          >
            View All
          </Button>
        </div>
        <Row xs={2} md={3} lg={4} className="g-3">
          {products.slice(0, 4).map((product) => (
            <Col key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      </Card>
    </section>
  );
}

export default function Home() {
  const { data: products, loading, error } = useFetch<Product[]>(
    getProducts
  );

  const byCategory = (category: string) =>
    (products ?? []).filter((p) => p.category === category);

  const topDeals = (products ?? [])
    .filter((p) => p.originalPrice && p.originalPrice > p.price)
    .sort((a, b) => {
      const discountA = a.originalPrice ? a.originalPrice - a.price : 0;
      const discountB = b.originalPrice ? b.originalPrice - b.price : 0;
      return discountB - discountA;
    });

  return (
    <Container fluid className="px-3 px-lg-4 py-3">
      <Row>
        {/* LEFT SIDEBAR */}
        <Col lg={2} className="d-none d-lg-block">
          <Card className="p-3 shadow-sm sticky-top" style={{ top: "1rem" }}>
            <h6 className="fw-bold mb-3">Top Categories</h6>
            <ul className="list-unstyled sidebar-categories">
              {sidebarCategories.map((cat) => (
                <li key={cat} className="mb-2">
                  <Link
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="text-decoration-none text-dark"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </Col>

        {/* RIGHT SIDE */}
        <Col lg={10}>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading && <Loading />}

          {!loading && !error && (
            <>
              {/* PROMOTIONAL BANNERS */}
              <Row className="g-3 mb-4">
                {banners.map((banner) => (
                  <Col md={4} key={banner.title}>
                    <Card className={`promo-banner ${banner.color} border-0`}>
                      <Card.Body>
                        <div className="small fw-semibold text-uppercase mb-1">
                          {banner.category}
                        </div>
                        <Card.Title className="fw-bold">
                          {banner.title}
                        </Card.Title>
                        <div className="small mb-1">
                          Starting at &#8377;{banner.startingPrice}
                        </div>
                        <div className="small mb-3">{banner.offer}</div>
                        <Button
                          as={Link as any}
                          to={`/products?category=${encodeURIComponent(
                            banner.category
                          )}`}
                          variant="light"
                          size="sm"
                          className="fw-semibold"
                        >
                          Shop Now
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <ProductSection title="Best of Mobiles" products={byCategory("Mobiles")} />
              <ProductSection title="Best of Laptops" products={byCategory("Laptops")} />
              <ProductSection title="Best of Tablets" products={byCategory("Tablets")} />
              <ProductSection title="Top Deals" products={topDeals} />
              <ProductSection title="Popular Brands" products={byCategory("Accessories")} />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
