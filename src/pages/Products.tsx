import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import { useFetch } from "../hooks/useFetch";
import { getProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import FilterBar, { defaultFilters } from "../components/FilterBar";
import type { Filters } from "../components/FilterBar";
import Loading from "../components/Loading";
import type { Product } from "../types";

type SortOption =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "newest";

export default function Products() {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const searchFromUrl = searchParams.get("search");

  const { data: products, loading, error } = useFetch<Product[]>(
    getProducts
  );

  const [search, setSearch] = useState(searchFromUrl ?? "");
  const [filters, setFilters] = useState<Filters>({
    ...defaultFilters,
    category: categoryFromUrl ?? "All",
  });
  const [sort, setSort] = useState<SortOption>("relevance");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = products ?? [];

    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.brand.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower)
      );
    }

    if (filters.category !== "All") {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.brand !== "All") {
      result = result.filter((p) => p.brand === filters.brand);
    }

    if (filters.rating !== "All") {
      const minRating = parseFloat(filters.rating);
      result = result.filter((p) => p.rating >= minRating);
    }

    if (filters.priceRange !== "All") {
      const [min, max] = filters.priceRange.split("-").map(Number);
      result = result.filter((p) => p.price >= min && p.price <= max);
    }

    const sorted = [...result];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        sorted.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      default:
        break;
    }

    return sorted;
  }, [products, search, filters, sort]);

  return (
    <Container fluid className="px-3 px-lg-4 py-3">
      <Row>
        {/* Desktop sidebar filters */}
        <Col lg={3} className="d-none d-lg-block">
          <FilterBar filters={filters} onChange={setFilters} />
        </Col>

        <Col lg={9}>
          <div className="d-flex flex-column flex-md-row gap-2 mb-3">
            <div className="flex-grow-1">
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <Form.Select
              style={{ maxWidth: "220px" }}
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: High to Low</option>
              <option value="newest">Newest</option>
            </Form.Select>
            <Button
              variant="outline-primary"
              className="d-lg-none"
              onClick={() => setShowFilters(true)}
            >
              Filters
            </Button>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {loading && <Loading />}

          {!loading && !error && filteredProducts.length === 0 && (
            <Alert variant="info">
              No products found. Try adjusting your search or filters.
            </Alert>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <Row xs={2} md={3} xl={4} className="g-3">
              {filteredProducts.map((product) => (
                <Col key={product.id}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>

      {/* Mobile filters via Offcanvas */}
      <Offcanvas
        show={showFilters}
        onHide={() => setShowFilters(false)}
        placement="start"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <FilterBar filters={filters} onChange={setFilters} />
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
}
