export type Price = {
  id: number;
  start: string;
  end: string;
  price: number;
};

export type Unit = {
  id: number;
  name: string;
  status: string;
};

export type UnitType = {
  id: number;
  name: string;
  units: Unit[];
  prices: Price[];
};

export type Reservation = {
  id: number;
  unitId: number;
  startDate: string;
  endDate: string;
  guestName: string;
  status: "confirmed" | "checked-in" | "checked-out";
};

export const reservations = [
  {
    id: 1,
    unitId: 1,
    startDate: "2024-09-01",
    endDate: "2024-09-03",
    guestName: "Cemile K.",
    status: "confirmed",
  },
  {
    id: 2,
    unitId: 1,
    startDate: "2024-09-03",
    endDate: "2024-09-06",
    guestName: "Alparslan K.",
    status: "checked-in",
  },
  {
    id: 6,
    unitId: 1,
    startDate: "2024-09-06",
    endDate: "2024-09-08",
    guestName: "Alparslan K.",
    status: "confirmed",
  },
  {
    id: 5,
    unitId: 3,
    startDate: "2024-09-05",
    endDate: "2024-09-10",
    guestName: "Bahadır K.",
    status: "checked-out",
  },
  {
    id: 51,
    unitId: 10,
    startDate: "2024-09-05",
    endDate: "2024-09-10",
    guestName: "Bahadır K.",
    status: "checked-out",
  },
];

export const units = [
  {
    id: 1,
    name: "Single Room",
    units: [
      { id: 1, name: "Room 101", status: "Needs Cleaning" },
      { id: 2, name: "Room 102", status: "Needs Cleaning" },
      { id: 3, name: "Room 103", status: "Clean" },
      { id: 4, name: "Room 104", status: "Clean" },
    ],
    prices: [
      { id: 1, start: "2024-09-01", end: "2024-09-10", price: 255 },
      { id: 2, start: "2024-09-11", end: "2024-09-20", price: 300 },
      { id: 3, start: "2024-09-21", end: "2024-09-30", price: 155 },
    ],
  },
  {
    id: 2,
    name: "Suite",
    units: [
      { id: 5, name: "Room 105", status: "Clean" },
      { id: 6, name: "Room 106", status: "Needs Cleaning" },
      { id: 7, name: "Room 109", status: "Clean" },
      { id: 8, name: "Room 108", status: "Clean" },
    ],
    prices: [
      { id: 1, start: "2024-09-01", end: "2024-09-10", price: 400 },
      { id: 2, start: "2024-09-11", end: "2024-09-20", price: 425 },
      { id: 3, start: "2024-09-21", end: "2024-09-30", price: 445 },
    ],
  },
  {
    id: 3,
    name: "Deluxe Room",
    units: [
      { id: 9, name: "Room 109", status: "Clean" },
      { id: 10, name: "Room 110", status: "Clean" },
      { id: 11, name: "Room 111", status: "Needs Cleaning" },
      { id: 12, name: "Room 112", status: "Clean" },
    ],
    prices: [
      { id: 1, start: "2024-09-01", end: "2024-09-10", price: 400 },
      { id: 2, start: "2024-09-11", end: "2024-09-20", price: 425 },
      { id: 3, start: "2024-09-21", end: "2024-09-30", price: 445 },
    ],
  },
  {
    id: 4,
    name: "Huge Room",
    units: [
      { id: 13, name: "Room 113", status: "Clean" },
      { id: 14, name: "Room 114", status: "Clean" },
      { id: 15, name: "Room 115", status: "Needs Cleaning" },
      { id: 16, name: "Room 116", status: "Clean" },
    ],
    prices: [
      { id: 1, start: "2024-09-01", end: "2024-09-10", price: 400 },
      { id: 2, start: "2024-09-11", end: "2024-09-20", price: 425 },
      { id: 3, start: "2024-09-21", end: "2024-09-30", price: 445 },
    ],
  },
];
