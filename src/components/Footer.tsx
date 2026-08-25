import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Footer() {
  return (
    <footer className="nexbuy-footer mt-5">
      <Container>
        <Row className="py-4 gy-4">
          <Col xs={6} md={3}>
            <h6 className="text-warning fw-bold">About NexBuy</h6>
            <ul className="list-unstyled small">
              <li>About Us</li>
              <li>Contact Us</li>
            </ul>
          </Col>
          <Col xs={6} md={3}>
            <h6 className="text-warning fw-bold">Help</h6>
            <ul className="list-unstyled small">
              <li>Payments</li>
              <li>Shipping</li>
              <li>Returns</li>
              <li>FAQ</li>
            </ul>
          </Col>
          <Col xs={6} md={3}>
            <h6 className="text-warning fw-bold">Policy</h6>
            <ul className="list-unstyled small">
              <li>Terms of Use</li>
              <li>Privacy</li>
              <li>Security</li>
            </ul>
          </Col>
          <Col xs={6} md={3}>
            <h6 className="text-warning fw-bold">
              <span className="text-white">Nex</span>
              <span className="text-warning">Buy</span>
            </h6>
            <p className="small text-light mb-0">
              Your trusted electronics marketplace for mobiles, laptops,
              tablets and accessories.
            </p>
          </Col>
        </Row>
        <div className="text-center small text-light py-3 border-top border-secondary">
          &copy; {new Date().getFullYear()} NexBuy. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
