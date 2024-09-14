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

export function drawHeaders(
  ctx: CanvasRenderingContext2D,
  currentDate: Dayjs,
  daysCount: number,
  today: Dayjs,
) {
  ctx.fillStyle = "rgb(255, 255, 255)"; // Beyaz arka plan
  ctx.fillRect(0, 0, ctx.canvas.width, 50);
  ctx.font = "bold 16px Arial"; // Yazı tipi ve boyutu
  ctx.textBaseline = "middle"; // Yazı ortalama
  for (let i = 0; i < daysCount; i++) {
    const x = i * cellWidth;
    const date = currentDate.add(i, "day");
    const isToday = date.isSame(today, "day");

    if (isToday) {
      ctx.fillStyle = "#f1f5f9"; // Bugün için özel arka plan rengi
      ctx.fillRect(x, 0, cellWidth, 50);
    }

    ctx.fillStyle = "rgb(34, 34, 34)"; // Siyah metin
    ctx.fillText(date.format("ddd D"), x + 10, 25);

    // Border bottom for date headers
    ctx.beginPath();
    ctx.moveTo(x, 50);
    ctx.lineTo(x + cellWidth, 50);
    ctx.strokeStyle = "rgb(200, 200, 200)"; // Bugün için özel alt çizgi rengi
    ctx.stroke();
  }
}

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
  daysCount: number,
) {
  let currentY = 50; // Header yüksekliğini 50px olarak kabul ediyoruz
  units.forEach((unitType: UnitType) => {
    currentY += 50; // Kategori satırı yüksekliği

    // Fiyat çizimi
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
          ctx.fillStyle = "rgba(241, 245, 249, 0.4)"; // Beyaz arka plan
          ctx.fillRect(x, currentY - 50, cellWidth, 50); // 40px yükseklik (daha küçük)
          ctx.fillStyle = "rgb(100, 116, 139)"; // Siyah metin
          ctx.fillText(
            `$${price.price}`,
            x + cellWidth / 2 - ctx.measureText(`$${price.price}`).width / 2,
            currentY - 25,
          ); // Ortalı metin, biraz daha yukarı
        }
      }
    });

    // Rezervasyonlar
    unitType.units.forEach(() => {
      ctx.moveTo(0, currentY);
      ctx.lineTo(ctx.canvas.width, currentY);
      ctx.strokeStyle = "rgb(200, 200, 200)"; // Gri çizgiler
      ctx.stroke();

      currentY += 50; // Satır yüksekliği
    });

    ctx.moveTo(0, currentY);
    ctx.lineTo(ctx.canvas.width, currentY);
    ctx.stroke();
  });
}
