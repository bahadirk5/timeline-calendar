"use client";

import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { reservations, units } from "./data";
import BookingComponent from "./booking-component";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cellWidth, drawGrid, drawPricesAndRooms } from "./utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function TimelineCalendar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [currentDate, setCurrentDate] = useState(dayjs().startOf("month"));
  const daysCount = currentDate.daysInMonth();
  const today = dayjs().startOf("day");

  // Calculate total height of all units
  const totalUnitsHeight = units.reduce((acc, unitType) => {
    return acc + 50 + unitType.units.length * 50;
  }, 0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const sidebar = sidebarRef.current;

    if (canvas && container && sidebar) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = cellWidth * daysCount * dpr;
        canvas.height = totalUnitsHeight * dpr;
        ctx.scale(dpr, dpr);

        canvas.style.width = `${cellWidth * daysCount}px`;
        canvas.style.height = `${totalUnitsHeight}px`;

        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

        drawGrid(ctx, daysCount);
        drawPricesAndRooms(ctx, currentDate, daysCount);
      }
    }
  }, [currentDate, daysCount, today, totalUnitsHeight]);

  useEffect(() => {
    const container = containerRef.current;
    const header = headerRef.current;
    const sidebar = sidebarRef.current;
    const content = contentRef.current;

    if (container && header && sidebar && content) {
      let isScrolling = false;

      const handleScroll = (e: Event) => {
        if (!isScrolling) {
          isScrolling = true;
          requestAnimationFrame(() => {
            const target = e.target as HTMLElement;
            if (target === content) {
              header.scrollLeft = content.scrollLeft;
              sidebar.scrollTop = content.scrollTop;
            } else if (target === sidebar) {
              content.scrollTop = sidebar.scrollTop;
            }
            isScrolling = false;
          });
        }
      };

      content.addEventListener("scroll", handleScroll);
      sidebar.addEventListener("scroll", handleScroll);

      return () => {
        content.removeEventListener("scroll", handleScroll);
        sidebar.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const handlePreviousMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month").startOf("month"));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, "month").startOf("month"));
  };

  const handleToday = () => {
    setCurrentDate(dayjs().startOf("month"));
  };

  const isMobile = useIsMobile()

  return (
    <div className="mx-auto w-full max-w-screen-xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          {currentDate.format("MMMM YYYY")}
        </h2>
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
      <div className="relative flex h-[calc(100vh-200px)] w-full overflow-hidden rounded-lg border-[2px]">
        <div
          ref={sidebarRef}
          className="sticky left-0 top-0 z-20 flex md:min-w-[250px] flex-col bg-background overflow-y-auto"
        >
          <div>
            <h3 className="w-full items-center flex px-4 h-[50px] font-semibold border-r">
              Units
            </h3>
          </div>
          <div className="flex-1">
            {units.map((unitType) => (
              <div key={unitType.id}>
                <div className="flex h-[50px] items-center bg-muted/40 border-y">
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
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isMobile ? <></> : <>{room.status}</>}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div
            ref={headerRef}
            className="sticky top-0 z-10 overflow-hidden border-b bg-background"
          >
            <div
              className="flex h-[50px]"
              style={{ width: `${cellWidth * daysCount}px` }}
            >
              {Array.from({ length: daysCount }).map((_, index) => {
                const date = currentDate.add(index, "day");
                const isToday = date.isSame(today, "day");
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex h-full w-[100px] flex-shrink-0 items-center justify-center text-sm font-semibold border-r",
                      isToday && "bg-muted"
                    )}
                  >
                    {date.format("ddd D")}
                  </div>
                );
              })}
            </div>
          </div>
          <div
            ref={contentRef}
            className="absolute inset-0 top-[50px] overflow-auto"
          >
            <div
              ref={containerRef}
              className="relative"
              style={{ 
                width: `${cellWidth * daysCount}px`, 
                height: `${totalUnitsHeight}px`
              }}
            >
              <canvas ref={canvasRef} className="absolute left-0 top-0" />
              <div className="absolute left-0 top-0">
                {reservations.map((reservation, index) => {
                  const unitType = units.find((rt) =>
                    rt.units.some((r) => r.id === reservation.unitId)
                  );
                  const unitIndex =
                    unitType?.units.findIndex(
                      (r) => r.id === reservation.unitId
                    ) || 0;
                  const unitTypeIndex = units.findIndex(
                    (rt) => rt.id === unitType?.id
                  );
                  const previousRoomTypesCount = units
                    .slice(0, unitTypeIndex)
                    .reduce((acc, rt) => acc + rt.units.length, 0);

                  const yOffset =
                    (unitTypeIndex + 1) * 50 + // Unit type headers
                    (previousRoomTypesCount + unitIndex) * 50; // Unit rows

                  return (
                    <BookingComponent
                      key={index}
                      booking={reservation}
                      cellWidth={cellWidth}
                      currentDate={currentDate}
                      yOffset={yOffset}
                      daysCount={daysCount}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}