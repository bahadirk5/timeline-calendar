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

export const cellWidth = 100; // Geniş hücre genişliği

export function drawGrid(ctx: CanvasRenderingContext2D, daysCount: number) {
  for (let i = 0; i <= daysCount; i++) {
    const x = i * cellWidth;
    ctx.moveTo(x, 50);
    ctx.lineTo(x, ctx.canvas.height);
    ctx.strokeStyle = "rgb(100, 116, 139)"; // Gri çizgiler
    ctx.stroke();
  }
}

export function drawPricesAndRooms(
  ctx: CanvasRenderingContext2D,
  currentDate: Dayjs,
  daysCount: number
) {
  let currentY = 0; // Start at the top of the canvas

  units.forEach((unitType: UnitType) => {
    // Draw unit type header
    ctx.fillStyle = "rgb(245, 245, 245)";
    ctx.fillRect(0, currentY, ctx.canvas.width, 50);
    ctx.fillStyle = "rgb(0, 0, 0)";

    currentY += 50; // Move down after unit type header

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
          ctx.fillStyle = "rgba(241, 245, 249, 0.4)";
          ctx.fillRect(x, currentY - 50, cellWidth, 50); // Draw in the unit type header row
          ctx.fillStyle = "rgb(100, 116, 139)";
          ctx.font = "14px Arial";
          ctx.fillText(
            `$${price.price}`,
            x + cellWidth / 2 - ctx.measureText(`$${price.price}`).width / 2,
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
      ctx.strokeStyle = "rgb(200, 200, 200)";
      ctx.stroke();

      currentY += 50; // Move down for next room
    });

    // Draw bottom border for the unit type
    ctx.beginPath();
    ctx.moveTo(0, currentY);
    ctx.lineTo(ctx.canvas.width, currentY);
    ctx.stroke();
  });
}
