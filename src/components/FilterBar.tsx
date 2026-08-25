import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export type Filters = {
  category: string;
  brand: string;
  rating: string;
  priceRange: string;
};

export const defaultFilters: Filters = {
  category: "All",
  brand: "All",
  rating: "All",
  priceRange: "All",
};

const categories = ["All", "Mobiles", "Laptops", "Tablets", "Accessories"];
const brands = ["All", "Apple", "Samsung", "Realme", "Xiaomi", "OnePlus"];
const ratings = [
  { label: "All Ratings", value: "All" },
  { label: "4+ & above", value: "4" },
  { label: "4.5+ & above", value: "4.5" },
];
const priceRanges = [
  { label: "All Prices", value: "All" },
  { label: "Under ₹10,000", value: "0-10000" },
  { label: "₹10,000 - ₹20,000", value: "10000-20000" },
  { label: "₹20,000 - ₹30,000", value: "20000-30000" },
  { label: "Above ₹30,000", value: "30000-999999999" },
];

type FilterBarProps = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const updateFilter = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onChange(defaultFilters);
  };

  return (
    <div className="filter-bar">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0">Filters</h6>
        <Button variant="link" size="sm" className="p-0" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      <Form.Group className="mb-3">
        <Form.Label className="small fw-semibold">Category</Form.Label>
        <Form.Select
          size="sm"
          value={filters.category}
          onChange={(e) => updateFilter("category", e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="small fw-semibold">Brand</Form.Label>
        <Form.Select
          size="sm"
          value={filters.brand}
          onChange={(e) => updateFilter("brand", e.target.value)}
        >
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="small fw-semibold">Rating</Form.Label>
        <Form.Select
          size="sm"
          value={filters.rating}
          onChange={(e) => updateFilter("rating", e.target.value)}
        >
          {ratings.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label className="small fw-semibold">Price</Form.Label>
        <Form.Select
          size="sm"
          value={filters.priceRange}
          onChange={(e) => updateFilter("priceRange", e.target.value)}
        >
          {priceRanges.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </div>
  );
}
