"use client";

import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { reservations, units } from "./data";
import BookingComponent from "./booking-component";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cellWidth, drawGrid, drawHeaders, drawPricesAndRooms } from "./utils";

export function TimelineCalendar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [currentDate, setCurrentDate] = useState(dayjs().startOf("month"));
  const daysCount = currentDate.daysInMonth(); // Gün sayısını ayın sonuna göre ayarlayın
  const today = dayjs().startOf("day");

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const sidebar = sidebarRef.current;

    if (canvas && container && sidebar) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Device pixel ratio kullanarak çözünürlüğü artırma
        const dpr = window.devicePixelRatio || 1;
        canvas.width = cellWidth * daysCount * dpr;
        canvas.height = sidebar.scrollHeight * dpr;
        ctx.scale(dpr, dpr);

        // Canvas boyutlarını CSS ile ayarlama
        canvas.style.width = `${cellWidth * daysCount}px`;
        canvas.style.height = `${sidebar.scrollHeight}px`;

        // Genel yapı
        ctx.fillStyle = "rgb(255, 255, 255)"; // Beyaz arka plan
        ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

        // Tarih başlıkları
        drawHeaders(ctx, currentDate, daysCount, today);

        // Hücre çizgileri
        drawGrid(ctx, daysCount);

        // Fiyatlandırma ve oda bilgileri
        drawPricesAndRooms(ctx, currentDate, daysCount);
      }
    }
  }, [currentDate, daysCount, today]);

  const handlePreviousMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month").startOf("month"));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, "month").startOf("month"));
  };

  const handleToday = () => {
    setCurrentDate(dayjs().startOf("month"));
  };

  return (
    <div className="mx-auto w-full max-w-screen-xl">
      <div className="mb-4 flex items-center justify-end">
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            &lt;
          </Button>
          <Button variant="outline" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            &gt;
          </Button>
        </div>
      </div>
      <div className="relative flex w-full rounded-lg border-[2px]">
        <div
          ref={sidebarRef}
          className="sticky left-0 top-0 z-10 min-w-[250px] overflow-y-auto bg-background"
        >
          <div className="flex h-[50px] items-center">
            <h2 className="px-4 text-2xl font-semibold tracking-tight">
              {currentDate.format("MMMM YYYY")}
            </h2>
          </div>
          {units.map((unitType) => (
            <div key={unitType.id}>
              <div className="flex h-[50px] items-center rounded bg-muted/40">
                <p className="px-4 font-semibold tracking-tight">
                  {unitType.name}
                </p>
              </div>
              {unitType.units.map((room) => (
                <div
                  key={room.id}
                  className="flex h-[50px] items-center justify-between px-4"
                >
                  <p className="text-muted-foreground">{room.name}</p>
                  <p
                    className={cn(
                      "rounded-md px-2 py-1 text-xs font-medium",
                      room.status === "Clean"
                        ? " bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {room.status}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="relative"></div>
        <div ref={containerRef} className="relative w-full overflow-x-scroll">
          <canvas ref={canvasRef} className="border-collapse" />
          <div className="absolute left-0 top-0">
            {reservations.map((reservation, index) => {
              const unitType = units.find((rt) =>
                rt.units.some((r) => r.id === reservation.unitId),
              );
              const unitIndex =
                unitType?.units.findIndex((r) => r.id === reservation.unitId) ||
                0;
              const unitTypeIndex = units.findIndex(
                (rt) => rt.id === unitType?.id,
              );
              const previousRoomTypesCount = units
                .slice(0, unitTypeIndex)
                .reduce((acc, rt) => acc + rt.units.length, 0);

              const yOffset =
                50 + // Başlık yüksekliği
                (unitTypeIndex + 1) * 50 + // Oda tipi başlıkları
                (previousRoomTypesCount + unitIndex) * 50; // Oda satırı

              return (
                <BookingComponent
                  key={index}
                  booking={reservation}
                  cellWidth={cellWidth}
                  currentDate={currentDate}
                  yOffset={yOffset}
                  daysCount={daysCount} // daysCount prop olarak geçiliyor
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
