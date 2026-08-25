import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

// A simple controlled search input with a clear button.
// Used on the Products page to filter the list currently on screen.
export default function SearchBar({
  value,
  onChange,
  placeholder = "Search products...",
}: SearchBarProps) {
  return (
    <InputGroup>
      <Form.Control
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <Button variant="outline-secondary" onClick={() => onChange("")}>
          Clear
        </Button>
      )}
    </InputGroup>
  );
}
