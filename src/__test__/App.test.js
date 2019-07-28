import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/cleanup-after-each";

import React from "react";
import { render, fireEvent } from "@testing-library/react";

import App from "../components/App";

function testNumber(num) {
  const renderComp = render(<App />);
  const input = renderComp.getByPlaceholderText(/masukkan nilai/i);
  const submitBtn = renderComp.getByText(/hitung/i);

  input.value = num;
  fireEvent.click(submitBtn);

  return { ...renderComp };
}

describe("Testing <App/> -- Negative Test Case --", () => {
  test("test input string value", () => {
    const { getByText } = testNumber("oops wrong");

    expect(getByText(/invalid number/i)).toBeDefined();
  });

  test("test input invalid separator", () => {
    const { getByText } = testNumber("17,000");

    expect(getByText(/invalid number/i)).toBeDefined();
  });

  test("test input with missing value", () => {
    const { getByText } = testNumber("Rp ");

    expect(getByText(/invalid number/i)).toBeDefined();
  });

  it("test input chracter in wrong position", () => {
    const { getByText } = testNumber("3000 Rp");

    expect(getByText(/invalid number/i)).toBeDefined();
  });
});

describe("Testing <App/> -- Positive Test Case --", () => {
  test("test input just a number", () => {
    const { getByTestId } = testNumber("15000");

    expect(getByTestId("listMoney").children.length).toBe(2);
  });

  test("test input with character Rp", () => {
    const { getByTestId } = testNumber("Rp3900");

    expect(getByTestId("listMoney").children.length).toBe(4);
  });

  test("test input where number has no available fraction", () => {
    const { getByTestId } = testNumber("12.510");

    expect(getByTestId("listMoney").children.length).toBe(4);
    expect(getByTestId("leftFractionText")).toBeDefined();
  });
});
