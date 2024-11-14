import React from "react";
import { Stage, Layer, Rect, Text, Group } from "react-konva";

const Aisle = ({ aisle, x, y }) => {
  return (
    <Group x={x} y={y}>
      {/* Aisle border */}
      <Rect
        width={aisle.width * 60}
        height={aisle.height * 60}
        stroke="#4B5563"
        strokeWidth={1}
      />

      {/* Aisle label */}
      <Rect x={0} y={0} width={aisle.width * 60} height={30} fill="#1F2937" />
      <Text
        text={`Aisle ${aisle.number}`}
        fontSize={14}
        fill="#F3F4F6"
        x={8}
        y={6}
      />
    </Group>
  );
};

const StoreLayout = ({ layoutData = null }) => {
  const CANVAS_WIDTH = 1200;
  const CANVAS_HEIGHT = 500;
  const BASE_CELL_SIZE = 60;
  const PADDING = 20;

  if (!layoutData) {
    return (
      <div className="w-full p-4 bg-gray-800 rounded-lg">
        <div className="text-center text-gray-500">
          No layout data available
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-gray-900 rounded-lg">
      <div className="relative">
        <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          <Layer>
            {/* Background */}
            <Rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#111827" />

            {/* Store name */}
            <Text
              text={`Store Layout - ${layoutData.storeName}`}
              x={PADDING}
              y={PADDING}
              fontSize={20}
              fill="#F3F4F6"
            />

            {/* Render aisles */}
            {layoutData.aisles.map((aisle, index) => (
              <Aisle
                key={aisle.id || index}
                aisle={aisle}
                x={aisle.posX * BASE_CELL_SIZE + PADDING}
                y={aisle.posY * BASE_CELL_SIZE + PADDING}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default StoreLayout;
