import { formatDate } from "@/lib/utils";

export const weeklyMenuGroups = [
  {
    key: "MON_CHINH",
    label: "MÓN CHÍNH",
    aliases: ["MON CHINH", "MÓN CHÍNH"],
    color: "bg-yellow-200 text-red-700",
    slots: ["1,1", "1,2", "1,3", "1,4", "1,5", "1,6"],
  },
  {
    key: "MAN_PHU",
    label: "MẶN PHỤ",
    aliases: ["MAN PHU", "MẶN PHỤ"],
    color: "bg-red-600 text-white",
    slots: ["1,6"],
  },
  {
    key: "MON_CHAY_CHINH",
    label: "MÓN CHAY CHÍNH",
    aliases: ["MON CHAY CHINH", "MÓN CHAY CHÍNH"],
    color: "bg-blue-200 text-blue-950",
    slots: ["1,7"],
  },
  {
    key: "MON_NUOC",
    label: "MÓN NƯỚC",
    aliases: ["MON NUOC", "MÓN NƯỚC"],
    color: "bg-orange-300 text-slate-950",
    slots: ["1,8"],
  },
  {
    key: "TRANG_MIENG",
    label: "TRÁNG MIỆNG",
    aliases: ["TRANG MIENG", "TRÁNG MIỆNG", "TM"],
    color: "bg-white text-slate-950",
    slots: ["TM"],
  },
] as const;

export const weekDayLabels = ["Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"];

export function parseDateInput(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function normalizeWeekStart(date: Date) {
  const normalized = new Date(date);
  normalized.setUTCHours(0, 0, 0, 0);
  const day = normalized.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  normalized.setUTCDate(normalized.getUTCDate() + diff);
  return normalized;
}

export function toDateInput(date: Date) {
  return new Date(date).toISOString().slice(0, 10);
}

export function weekEndDate(startDate: Date) {
  const end = new Date(startDate);
  end.setUTCDate(end.getUTCDate() + 5);
  return end;
}

export function getWeekDates(startDate: Date) {
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(startDate);
    date.setUTCDate(date.getUTCDate() + index);
    return date;
  });
}

export function makeWeeklyTitle(startDate: Date, endDate: Date) {
  return `MENU TUẦN ${formatDate(startDate)} ~ ${formatDate(endDate)}`;
}

export function emptyWeeklyCells() {
  return weeklyMenuGroups.flatMap((group) =>
    group.slots.flatMap((slot) =>
      Array.from({ length: 6 }, (_, dayIndex) => ({
        group: group.key,
        slot,
        dayIndex,
        dishName: "",
      })),
    ),
  );
}

export type WeeklyCellInput = {
  group: string;
  slot: string;
  dayIndex: number;
  dishName: string;
};

export function serializeWeeklyMenuCsv({
  title,
  startDate,
  cells,
}: {
  title: string;
  startDate: Date;
  cells: Array<{ group: string; slot: string; dayIndex: number; dishName: string }>;
}) {
  const dates = getWeekDates(startDate);
  const cellMap = new Map(cells.map((cell) => [`${cell.group}:${cell.slot}:${cell.dayIndex}`, cell.dishName]));
  const rows = [
    [title],
    ["Nhóm", "Món", ...dates.map((date, index) => `${formatDate(date)} Thứ ${weekDayLabels[index]}`)],
  ];

  for (const group of weeklyMenuGroups) {
    for (const slot of group.slots) {
      rows.push([
        group.label,
        slot,
        ...dates.map((_, dayIndex) => cellMap.get(`${group.key}:${slot}:${dayIndex}`) ?? ""),
      ]);
    }
  }

  return `\uFEFF${rows.map((row) => row.map(escapeCsvValue).join(",")).join("\n")}`;
}

export function parseWeeklyMenuCsv(text: string) {
  const rows = parseDelimitedRows(text.replace(/^\uFEFF/, ""));
  const byLabel = new Map(
    weeklyMenuGroups.flatMap((group) =>
      group.aliases.map((alias) => [normalize(alias), group] as const),
    ),
  );
  const cells: WeeklyCellInput[] = [];
  let currentGroup: (typeof weeklyMenuGroups)[number] | undefined;

  for (const row of rows) {
    const first = normalize(row[0] ?? "");
    const second = normalize(row[1] ?? "");
    const explicitGroup = byLabel.get(first);
    const slot = row[1]?.trim();

    if (explicitGroup) {
      currentGroup = explicitGroup;
    }

    if (
      !currentGroup ||
      !slot ||
      first.includes("ngay") ||
      first.includes("thu") ||
      first.includes("ca trua") ||
      second === "mon" ||
      second === "mon"
    ) {
      continue;
    }

    for (let dayIndex = 0; dayIndex < 6; dayIndex++) {
      cells.push({
        group: currentGroup.key,
        slot,
        dayIndex,
        dishName: row[dayIndex + 2]?.trim() ?? "",
      });
    }
  }

  return cells;
}

function normalize(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ");
}

function escapeCsvValue(value: string) {
  const safeValue = /^[=+\-@]/.test(value) ? `'${value}` : value;

  if (!/[",\n]/.test(safeValue)) {
    return safeValue;
  }

  return `"${safeValue.replace(/"/g, '""')}"`;
}

function parseDelimitedRows(text: string) {
  return parseCsvRows(text, detectDelimiter(text));
}

function detectDelimiter(text: string) {
  const contentLines = text
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().toUpperCase().startsWith("MENU"))
    .slice(0, 20);

  if (!contentLines.length) return ",";

  const candidates = [",", ";", "\t"];
  return candidates
    .map((delimiter) => ({
      delimiter,
      count: contentLines.reduce((total, line) => total + line.split(delimiter).length - 1, 0),
    }))
    .sort((a, b) => b.count - a.count)[0]?.delimiter ?? ",";
}

function parseCsvRows(text: string, delimiter: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === delimiter && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") {
        index++;
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell);
  rows.push(row);
  return rows;
}
