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
            <Nav.Link href="/tramites?ver=todos">Tramites</Nav.Link>
            <NavDropdown title="Categorias" id="top-menu">
              {categories.map((category) => (
                <NavDropdown.Item
                  key={category.id}
                  href={`/tramites?category=${category.slug}`}
                >
                  {category.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <NavDropdown title="Areas" id="top-menu">
              {areas.map((area) => (
                <NavDropdown.Item
                  key={area.id}
                  href={`/tramites?area=${area.slug}`}
                >
                  {area.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <NavDropdown title="Ayuda" id="top-menu">
              <NavDropdown.Item
                href="https://cidi.cba.gov.ar/portal-publico/acceso"
                target="_blank"
              >
                Niveles de CiDI
              </NavDropdown.Item>
              <NavDropdown.Item
                href="https://prensa.cba.gov.ar/informacion-general/ciudadano-digital-el-paso-a-paso-para-obtener-cidi-nivel-2/"
                target="_blank"
              >
                Obtener CIDI Nivel 2
              </NavDropdown.Item>
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
