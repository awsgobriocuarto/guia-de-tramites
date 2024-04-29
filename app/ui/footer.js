import Image from "next/image";
import React from "react";

export default function Footer() {
  return (
    <footer>
      <Image
        src="/images/brand.svg"
        width="120"
        height="80"
        alt="logo"
        className="ms-md-4"
        priority={true}
      />
    </footer>
  );
}
