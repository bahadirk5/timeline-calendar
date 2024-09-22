import React from "react";
import dayjs from "dayjs";

import { cn } from "@/lib/utils";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface Props {
  booking: {
    id: number;
    unitId: number;
    startDate: string;
    endDate: string;
    guestName: string;
    status: string;
  };
  cellWidth: number;
  currentDate: dayjs.Dayjs;
  yOffset: number;
  daysCount: number;
}

const BookingComponent: React.FC<Props> = ({
  booking,
  cellWidth,
  currentDate,
  yOffset,
  daysCount,
}) => {
  const start = dayjs(booking.startDate).diff(currentDate, "day");
  const end = dayjs(booking.endDate)
    .subtract(1, "day")
    .diff(currentDate, "day");

  const adjustedStart = Math.max(start, -0.5); // Ensure start is not before current month
  let adjustedEnd = Math.min(end, currentDate.daysInMonth() - 1.5); // Ensure end is not after current month
  let allow = false;
  if (adjustedEnd == -1) {
    adjustedEnd = -1;
    allow = true;
  }

  if (adjustedStart >= daysCount || (adjustedEnd <= -1 && !allow)) return null; // Skip bookings not in the current month

  const bookingWidth = (adjustedEnd - adjustedStart + 1) * cellWidth;
  const styles = {
    left: `${(adjustedStart + 0.5) * cellWidth}px`,
    width: `${bookingWidth - 4}px`,
    top: `${yOffset + 5}px`,
    marginRight: "4px",
  };

  const startDate = dayjs(booking.startDate);
  const endDate = dayjs(booking.endDate);

  return (
    <div className="relative mr-2">
      <HoverCard>
        <HoverCardTrigger
          className={cn(
            "absolute flex h-10 items-center justify-between rounded-lg border px-2 text-xs",
            booking.status === "confirmed" &&
              "bg-blue-500 text-primary-foreground hover:bg-blue-500/90",
            booking.status === "checked-in" &&
              "bg-green-500 text-primary-foreground hover:bg-green-500/90",
            booking.status === "checked-out" &&
              "bg-slate-800 text-primary-foreground hover:bg-slate-800/90"
          )}
          style={styles}
        >
          <span>{booking.guestName}</span>
          <span>
            {startDate.format("DD")} - {endDate.format("DD")}{" "}
            {endDate.format("MMM")}
          </span>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 rounded-md bg-white p-4 shadow-lg dark:bg-gray-950">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold">{booking.guestName}</h4>
            <div
              className={cn(
                "rounded-md px-2 py-1 font-medium",
                booking.status === "confirmed"
                  ? " bg-green-100 text-green-600"
                  : "bg-red-100 text-red-400"
              )}
            >
              <p className="text-xs">{booking.status}</p>
            </div>
          </div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Check-in:</span>
              <span className="text-sm font-semibold">{booking.startDate}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Check-out:</span>
              <span className="text-sm font-semibold">{booking.endDate}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Room:</span>
              <span className="text-sm font-semibold">{booking.unitId}</span>
            </li>
          </ul>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default BookingComponent;
