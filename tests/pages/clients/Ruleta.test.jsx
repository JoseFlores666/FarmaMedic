import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Ruleta from "../../../src/pages/Clients/Ruleta";

describe("Ruleta (Cliente)", () => {
  it("debe renderizar correctamente el componente Ruleta del cliente", () => {
    render(<Ruleta />);
    const texto = screen.getByText(/ruleta/i);
    expect(texto).toBeInTheDocument();
  });
});

