"use client";
import Image from "next/image";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

export default function Menu({ categories = {}, areas = {} }) {
  return (
    <Navbar expand="lg" className="bg-primary" variant="dark">
      <Container>
        <Navbar.Brand as={Link} href="/">
          Guía de Trámites
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} href="/">
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} href="/tramites">
              Tramites
            </Nav.Link>
            <NavDropdown title="Categorias" id="basic-nav-dropdown">
              {categories.map((category) => (
                <NavDropdown.Item
                  key={category.id}
                  href={`/tramites?category=${category.slug}`}
                >
                  {category.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <NavDropdown title="Areas" id="basic-nav-dropdown">
              {areas.map((area) => (
                <NavDropdown.Item
                  key={area.id}
                  href={`/tramites?area=${area.slug}`}
                >
                  {area.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
          <Image
            src="/images/brand.svg"
            width="150"
            height="80"
            alt="logo"
            className="ms-md-4"
            priority={true}
          />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
