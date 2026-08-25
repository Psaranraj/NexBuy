import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Dropdown from "react-bootstrap/Dropdown";

import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { getProducts } from "../api/productApi";
import type { Product } from "../types";

const categories = [
  "Mobiles",
  "Laptops",
  "Tablets",
  "Accessories",
  "Offers",
  "Top Brands",
  "New Arrivals",
];

export default function Header() {
  const auth = useContext(AuthContext);
  const cartContext = useContext(CartContext);

  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const user = auth?.user ?? null;
  const cart = cartContext?.cart ?? [];

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    getProducts()
      .then((data) => setAllProducts(data))
      .catch(() => setAllProducts([]));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);

    if (value.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const lower = value.toLowerCase();

    const matches = allProducts
      .filter(
        (product) =>
          product.name.toLowerCase().includes(lower) ||
          product.brand.toLowerCase().includes(lower) ||
          product.category.toLowerCase().includes(lower),
      )
      .slice(0, 6);

    setSuggestions(matches);
    setShowSuggestions(true);
  };

  const runSearch = (value: string) => {
    setShowSuggestions(false);

    if (value.trim().length === 0) {
      navigate("/products");
    } else {
      navigate(`/products?search=${encodeURIComponent(value.trim())}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  const handleLogout = () => {
    if (auth) {
      auth.logout();
    }

    navigate("/");
  };

  return (
    <>
      <Navbar expand="lg" className="nexbuy-navbar" variant="dark">
        <Container fluid className="px-3 px-lg-4">
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 me-3">
            <span className="text-white">Nex</span>

            <span className="text-warning">Buy</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />

          <Navbar.Collapse id="main-navbar">
            <div
              className="position-relative flex-grow-1 my-2 my-lg-0 mx-lg-3"
              ref={wrapperRef}
            >
              <Form className="d-flex" onSubmit={handleSubmit}>
                <Form.Control
                  type="search"
                  placeholder="Search for mobiles, laptops, tablets and more"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  onFocus={() => {
                    if (query) {
                      setShowSuggestions(true);
                    }
                  }}
                  className="search-input"
                />

                <Button
                  type="submit"
                  variant="warning"
                  className="search-btn fw-semibold"
                >
                  Search
                </Button>
              </Form>

              {showSuggestions && suggestions.length > 0 && (
                <div className="search-suggestions shadow">
                  {suggestions.map((product) => (
                    <div
                      key={product.id}
                      className="search-suggestion-item"
                      onClick={() => {
                        setShowSuggestions(false);
                        setQuery(product.name);

                        navigate(`/products/${product.id}`);
                      }}
                    >
                      <span className="fw-semibold">{product.name}</span>{" "}
                      <span className="text-muted small">
                        in {product.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Nav className="align-items-lg-center gap-lg-3">
              {user ? (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="outline-light"
                    className="border-0 fw-semibold"
                  >
                    Hi, {user.name.split(" ")[0]}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/order-history">
                      Orders
                    </Dropdown.Item>

                    <Dropdown.Item as={Link} to="/addresses">
                      Addresses
                    </Dropdown.Item>

                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="fw-semibold text-white"
                >
                  Login
                </Nav.Link>
              )}

              {user && (
                <>
                  <Nav.Link
                    as={Link}
                    to="/wishlist"
                    className="text-white fw-semibold"
                  >
                    Wishlist
                  </Nav.Link>

                  <Nav.Link
                    as={Link}
                    to="/cart"
                    className="text-white fw-semibold position-relative"
                  >
                    Cart
                    {cartCount > 0 && (
                      <Badge bg="warning" text="dark" className="ms-1">
                        {cartCount}
                      </Badge>
                    )}
                  </Nav.Link>
                </>
              )}

              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="outline-light"
                  className="border-0 fw-semibold"
                >
                  More
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/products">
                    All Products
                  </Dropdown.Item>

                  {user && (
                    <Dropdown.Item as={Link} to="/order-history">
                      Order History
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="category-nav">
        <Container fluid className="px-3 px-lg-4">
          <Nav className="flex-nowrap overflow-auto category-nav-inner">
            {categories.map((category) => (
              <Nav.Link
                key={category}
                as={Link}
                to={`/products?category=${encodeURIComponent(category)}`}
                className="text-nowrap"
              >
                {category}
              </Nav.Link>
            ))}
          </Nav>
        </Container>
      </div>
    </>
  );
}
