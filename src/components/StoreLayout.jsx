import React, { useState, useEffect } from "react";
import { Stage, Layer, Rect, Text, Group, Line } from "react-konva";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";

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
    <div className="modal show d-flex align-items-center justify-content-center">
      <div
        className="modal-backdrop"
        style={{
          position: "fixed",
          inset: "0",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onClick={onClose}
      ></div>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark text-light">{children}</div>
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
  const CANVAS_HEIGHT = 600;
  const BASE_CELL_SIZE = 60; // Base size for 1x1 cell
  const PADDING = 20;
  const SECTION_LABEL_PADDING = 8;
  const SECTION_LABEL_HEIGHT = 30;

  const calculateSectionPosition = (section) => {
    if (section.type === "aisle") {
      return {
        x: section.posX,
        y: section.posY,
      };
    }

    if (section.type === "trolly-bay") {
      return {
        x: section.posX,
        y: section.posY,
      };
    }

    if (section.type === "section") {
      let maxX = 0;
      let maxY = 0;

      layoutData.sections.forEach((s) => {
        if (s.number) return;
        const sectionEndX =
          s.posX +
          (s.cells ? Math.max(...s.cells.map((c) => c.posX + c.width)) : 0);
        const sectionEndY =
          s.posY +
          (s.cells ? Math.max(...s.cells.map((c) => c.posY + c.height)) : 0);
        maxX = Math.max(maxX, sectionEndX);
        maxY = Math.max(maxY, sectionEndY);
      });

      return {
        x: section.posX,
        y: section.posY,
      };
    }
  };

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
        return "badge bg-success";
      case "undetermined":
        return "badge bg-warning text-dark";
      case "out-of-stock":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  const calculateSectionDimensions = (section) => {
    if (section.type === "aisle") {
      return {
        width: section.width,
        height: section.height,
      };
    }

    if (section.type === "section") {
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
    }

    if (section.type === "trolly-bay") {
      return {
        width: section.width,
        height: section.height,
      };
    }
  };

  const ShelfSection = ({ section, x, y }) => {
    if (section.type === "aisle") {
      return (
        <Group x={x} y={y}>
          <Rect
            x={0}
            y={0}
            width={section.width * 60}
            height={section.height * 30}
            // stroke={"white"}
            // strokeWidth={2}
          />
          <Line
            points={[
              0,
              section.height * 30 * 0.5,
              section.width * 60,
              section.height * 30 * 0.5,
            ]}
            stroke="green"
            dash={[33, 10]}
          />
          <Text
            text={`Aisle ${section.number}`}
            fontSize={14}
            fill="#F3F4F6"
            x={section.width * 60 * 0.5}
            y={section.height * 30 * 0.5}
          />
        </Group>
      );
    }

    const { name, cells = [] } = section;
    const dimensions = calculateSectionDimensions(section);
    const sectionWidth = dimensions.width * BASE_CELL_SIZE;
    const sectionHeight =
      dimensions.height * BASE_CELL_SIZE + SECTION_LABEL_HEIGHT;

    return (
      <Group x={x} y={y}>
        <Rect
          x={0}
          y={0}
          width={sectionWidth}
          height={SECTION_LABEL_HEIGHT}
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

  if (!layoutData || !layoutData.sections) {
    return (
      <div className="container-fluid p-4 bg-dark rounded">
        <div className="text-center text-secondary">
          No valid layout data available
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4 bg-dark rounded">
      <div className="position-relative">
        <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          <Layer>
            {/* Background */}
            <Rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#111827" />

            {/* Store name */}
            <Text
              text={`Store Layout - ${layoutData.storeName || "Store"}`}
              x={PADDING}
              y={PADDING}
              fontSize={20}
              fill="#F3F4F6"
            />
            {/* Render sections and aisles */}
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
          </Layer>
        </Stage>

        {tooltip && (
          <div
            className="position-absolute bg-secondary text-white px-2 py-1 rounded text-sm"
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

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="modal-header">
            <h5 className="modal-title">{selectedCell?.product}</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setIsModalOpen(false)}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-12 d-flex justify-content-between">
                <span className="text-muted">Section:</span>
                <span className="text-light">{selectedCell?.section}</span>
              </div>
              <div className="col-12 d-flex justify-content-between">
                <span className="text-muted">Size:</span>
                <span className="text-light">
                  {selectedCell?.width}x{selectedCell?.height}
                </span>
              </div>
              <div className="col-12 d-flex justify-content-between">
                <span className="text-muted">Position:</span>
                <span className="text-light">
                  ({selectedCell?.posX}, {selectedCell?.posY})
                </span>
              </div>
              <div className="col-12 d-flex justify-content-between">
                <span className="text-muted">Status:</span>
                <span className={`${getStatusClass(selectedCell?.status)}`}>
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
