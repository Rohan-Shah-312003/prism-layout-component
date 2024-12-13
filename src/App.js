import "./App.css";
import StoreLayout from "./components/StoreLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// will be available from the API

const sampleLayoutData = {
  storeName: "Store 001",
  sections: [
    {
      id: "trolly-bay",
      width: 10,
      type: "trolly-bay",
      height: 6,
      posX: 0,
      posY: 0,
    },
    {
      id: "aisle-1",
      type: "aisle",
      number: 1,
      posX: 1,
      posY: 2,
      width: 6,
      height: 1,
    },
    {
      id: "aisle-2",
      type: "aisle",
      number: 2,
      posX: 1,
      posY: 3,
      width: 6,
      height: 5,
    },
    {
      id: "frozen-section",
      name: "Frozen",
      type: "section",
      posX: 9,
      posY: 0,
      cells: [
        {
          product: "Shelf 1",
          status: "in-stock",
          posX: 0, // Relative to section
          posY: 0,
          width: 2, // 2x1 cell
          height: 1,
        },
        {
          product: "Shelf 2",
          status: "out-of-stock",
          posX: 2,
          posY: 0,
          width: 1, // 1x2 cell
          height: 2,
        },
        {
          product: "Shelf 3",
          status: "in-stock",
          posX: 0,
          posY: 1,
          width: 2, // 2x1 cell
          height: 1,
        },
      ],
    },
    {
      id: "sweet-section",
      name: "Sweets",
      type: "section",
      posX: 8,
      posY: 4,
      cells: [
        {
          product: "Shelf 1",
          status: "in-stock",
          posX: 0,
          posY: 0,
          width: 2, // 2x2 cell
          height: 2,
        },
        {
          product: "Shelf 2",
          status: "undetermined",
          posX: 2,
          posY: 0,
          width: 1, // 1x1 cell
          height: 1,
        },
        {
          product: "Shelf 3",
          status: "",
          posX: 2,
          posY: 1,
          width: 2, // 2x2 cell
          height: 2,
        },
      ],
    },
  ],
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<StoreLayout layoutData={sampleLayoutData} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
