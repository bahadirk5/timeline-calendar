import { units } from "./data";
import dayjs, { Dayjs } from "dayjs";

export type UnitType = {
  id: number;
  name: string;
  units: {
    id: number;
    name: string;
    status: string;
  }[];
  prices: {
    id: number;
    start: string;
    end: string;
    price: number;
  }[];
};

export const cellWidth = 100;

export function drawGrid(ctx: CanvasRenderingContext2D, daysCount: number) {
  const borderColor = "hsl(0 0% 89.8%)";
  ctx.lineWidth = 1;

  for (let i = 0; i <= daysCount; i++) {
    const x = i * cellWidth;
    ctx.beginPath();
    ctx.moveTo(x, 0); // Changed from 50 to 0 to start from the very top
    ctx.lineTo(x, ctx.canvas.height);
    ctx.strokeStyle = borderColor;
    ctx.stroke();
  }
}

export function drawPricesAndRooms(
  ctx: CanvasRenderingContext2D,
  currentDate: Dayjs,
  daysCount: number
) {
  let currentY = 0;
  const borderColor = "hsl(0 0% 89.8%)";
  const foregroundColor = "hsl(0 0% 3.9%)"; // Changed to a darker color for better visibility
  ctx.lineWidth = 1;

  units.forEach((unitType: UnitType) => {
    // Draw top border for each unit type
    ctx.beginPath();
    ctx.moveTo(0, currentY);
    ctx.lineTo(ctx.canvas.width, currentY);
    ctx.strokeStyle = borderColor;
    ctx.stroke();

    // Draw unit type header
    ctx.fillStyle = "hsl(0 0% 96.1% / 0.4)";
    ctx.fillRect(0, currentY, ctx.canvas.width, 50);

    currentY += 50;

    // Draw prices
    unitType.prices.forEach((price) => {
      const startDate = dayjs(price.start).startOf("day");
      const endDate = dayjs(price.end).endOf("day");
      for (
        let date = startDate;
        date.isBefore(endDate) || date.isSame(endDate);
        date = date.add(1, "day")
      ) {
        const diff = date.diff(currentDate, "day");
        if (diff >= 0 && diff < daysCount) {
          const x = diff * cellWidth;
          ctx.fillStyle = "hsl(0 0% 96.1% / 0.4)";
          ctx.fillRect(x, currentY - 50, cellWidth, 50);
          ctx.fillStyle = foregroundColor;
          ctx.font = "12px Arial";
          const priceText = `$${price.price}`;
          const textWidth = ctx.measureText(priceText).width;
          ctx.fillText(
            priceText,
            x + (cellWidth - textWidth) / 2,
            currentY - 25
          );
        }
      }
    });

    // Draw room rows
    unitType.units.forEach(() => {
      ctx.beginPath();
      ctx.moveTo(0, currentY);
      ctx.lineTo(ctx.canvas.width, currentY);
      ctx.strokeStyle = borderColor;
      ctx.stroke();

      currentY += 50;
    });
  });

  // Draw bottom border for the last unit type
  ctx.beginPath();
  ctx.moveTo(0, currentY);
  ctx.lineTo(ctx.canvas.width, currentY);
  ctx.strokeStyle = borderColor;
  ctx.stroke();

  console.log("Finished drawing prices and rooms");
}