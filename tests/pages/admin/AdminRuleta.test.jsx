import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AdminRuleta from "../../../src/pages/Admin/AdminRuleta";

describe("AdminRuleta", () => {
  it("debe renderizar correctamente el título o contenido principal", () => {
    render(<AdminRuleta />);
    const texto = screen.getByText(/ruleta/i);
    expect(texto).toBeInTheDocument();
  });
});
