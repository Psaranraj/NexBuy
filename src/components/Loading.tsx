import Spinner from "react-bootstrap/Spinner";

export default function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <Spinner animation="border" variant="primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}
