import React, { useState, useEffect } from "react";
import { Stage, Layer, Rect, Text, Group } from "react-konva";

const Aisle = ({ aisle, x, y }) => {
  return (
    <Group x={x} y={y}>
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

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
};

const StoreLayout = ({ layoutData = null }) => {
  const [tooltip, setTooltip] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Constants for layout
  const CANVAS_WIDTH = 1200;
  const CANVAS_HEIGHT = 500;
  const BASE_CELL_SIZE = 60; // Base size for 1x1 cell
  const PADDING = 20;
  const SECTION_LABEL_PADDING = 8;
  const SECTION_LABEL_HEIGHT = 30;


   const calculateSectionPosition = (section) => {
     let maxAisleX = 0;
     let maxAisleY = 0;

     layoutData.aisles.forEach((aisle) => {
       const aisleEndX = aisle.posX + aisle.width;
       const aisleEndY = aisle.posY + aisle.height;
       maxAisleX = Math.max(maxAisleX, aisleEndX);
       maxAisleY = Math.max(maxAisleY, aisleEndY);
     });

     return {
       x: section.posX > maxAisleX ? section.posX : maxAisleX + 1,
       y: section.posY > maxAisleY ? section.posY : maxAisleY + 1,
     };
   };

  // Color mapping
  const getColor = (status) => {
    switch (status?.toLowerCase()) {
      case "in-stock":
        return "#10B981";
      case "undetermined":
        return "#F59E0B";
      case "out-of-stock":
        return "#EF4444";
      default:
        return "#374151";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "in-stock":
        return "Available in store";
      case "undetermined":
        return "Stock status unknown";
      case "out-of-stock":
        return "Currently unavailable";
      default:
        return "No status available";
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "in-stock":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "undetermined":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "out-of-stock":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    }
  };

  // Calculate section dimensions based on cell sizes
  const calculateSectionDimensions = (section) => {
    let maxX = 0;
    let maxY = 0;

    section.cells.forEach((cell) => {
      const cellEndX = cell.posX + cell.width;
      const cellEndY = cell.posY + cell.height;
      maxX = Math.max(maxX, cellEndX);
      maxY = Math.max(maxY, cellEndY);
    });

    return {
      width: maxX,
      height: maxY,
    };
  };

  const ShelfSection = ({ section, x, y }) => {
    const { name, cells = [] } = section;
    const dimensions = calculateSectionDimensions(section);
    const sectionWidth = dimensions.width * BASE_CELL_SIZE;
    const sectionHeight =
      dimensions.height * BASE_CELL_SIZE + SECTION_LABEL_HEIGHT;

    return (
      <Group x={x} y={y}>
        {/* Section border */}
        {/* Remove the border */}
        <Rect
          width={sectionWidth}
          height={sectionHeight}
          stroke="#4B5563"
          strokeWidth={1}
        />

        {/* Section name */}
        <Rect
          x={0}
          y={0}
          width={sectionWidth}
          height={SECTION_LABEL_HEIGHT}
          fill="#1F2937" // remove the filling part
          onClick={() => {
            setSelectedCell({
              product: name,
              section: name,
              posX: 0,
              posY: 0,
              width: dimensions.width,
              height: 1,
            });
            setIsModalOpen(true);
          }}
          onTap={() => {
            setSelectedCell({
              product: name,
              section: name,
              posX: 0,
              posY: 0,
              width: dimensions.width,
              height: 1,
            });
            setIsModalOpen(true);
          }}
        />
        <Text
          text={name}
          fontSize={14}
          fill="#F3F4F6"
          x={SECTION_LABEL_PADDING}
          y={SECTION_LABEL_PADDING}
        />

        {/* Render cells */}
        {cells.map((cell, index) => {
          const cellWidth = cell.width * BASE_CELL_SIZE - 4;
          const cellHeight = cell.height * BASE_CELL_SIZE - 4;
          const cellX = cell.posX * BASE_CELL_SIZE + 2;
          const cellY = cell.posY * BASE_CELL_SIZE + 2 + SECTION_LABEL_HEIGHT;

          if (cell.type === "label") {
            return (
              <Text
                key={index}
                text={cell.product}
                fontSize={12}
                fill="#9CA3AF"
                x={cellX}
                y={cellY}
                width={cellWidth}
                height={cellHeight}
                align="center"
                verticalAlign="middle"
                onClick={() => {
                  setSelectedCell(cell);
                  setIsModalOpen(true);
                }}
                onTap={() => {
                  setSelectedCell(cell);
                  setIsModalOpen(true);
                }}
              />
            );
          } else {
            return (
              <Rect
                key={index}
                x={cellX}
                y={cellY}
                width={cellWidth}
                height={cellHeight}
                fill={getColor(cell.status)}
                cornerRadius={2}
                onMouseEnter={(e) => {
                  const stage = e.target.getStage();
                  const containerRect = stage
                    .container()
                    .getBoundingClientRect();

                  setTooltip({
                    text: `${cell.product}: ${cell.status}`,
                    x: containerRect.left + e.target.x() + x + cellWidth / 2,
                    y: containerRect.top + e.target.y() + y,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
                onClick={() => {
                  setSelectedCell(cell);
                  setIsModalOpen(true);
                }}
                onTap={() => {
                  setSelectedCell(cell);
                  setIsModalOpen(true);
                }}
              />
            );
          }
        })}
      </Group>
    );
  };

 if (!layoutData || !layoutData.sections || !layoutData.aisles) {
   return (
     <div className="w-full p-4 bg-gray-900 rounded-lg">
       <div className="text-center text-gray-500">
         No valid layout data available
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

            {/* Render sections */}
            {layoutData.sections.map((section, index) => {
              const { x, y } = calculateSectionPosition(section);
              return (
                <ShelfSection
                  key={section.id || index}
                  section={section}
                  x={x * BASE_CELL_SIZE + PADDING}
                  y={y * BASE_CELL_SIZE + PADDING}
                />
              );
            })}

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

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute bg-gray-800 text-white px-2 py-1 rounded text-sm pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
              zIndex: 1000,
            }}
          >
            {tooltip.text}
          </div>
        )}

        {/* Custom Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedCell?.product}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">
                  Section:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedCell?.section}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Size:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedCell?.width}x{selectedCell?.height}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">
                  Position:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ({selectedCell?.posX}, {selectedCell?.posY})
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">
                  Status:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                    selectedCell?.status
                  )}`}
                >
                  {getStatusText(selectedCell?.status)}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default StoreLayout;
