import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function dbDateOnly(date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

const menuItems = [
  ["Cơm sườn nướng mật ong", "MAN", 35000],
  ["Cơm gà sốt tiêu xanh", "MAN", 39000],
  ["Cá kho tộ rau luộc", "MAN", 37000],
  ["Cơm chay nấm kho gừng", "CHAY", 35000],
  ["Đậu hũ sốt cà nấm", "CHAY", 35000],
  ["Trà tắc mật ong", "NUOC", 12000],
  ["Canh rong biển thịt bằm", "THEM", 12000],
];

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword || adminPassword.length < 16) {
    throw new Error("Set SEED_ADMIN_EMAIL and a unique SEED_ADMIN_PASSWORD (at least 16 characters) before seeding.");
  }
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      companyName: "Cơm Văn Phòng Mến",
      role: "ADMIN",
      isApproved: true,
    },
    create: {
      companyName: "Cơm Văn Phòng Mến",
      email: adminEmail,
      phone: "0900000000",
      address: "TP.HCM",
      role: "ADMIN",
      isApproved: true,
      password: passwordHash,
    },
  });

  const createdItems = [];

  for (const [name, category, price] of menuItems) {
    const item = await prisma.menuItem.upsert({
      where: { name },
      update: { category, price, isAvailable: true },
      create: { name, category, price },
    });
    createdItems.push(item);
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const tomorrowDate = dbDateOnly(tomorrow);

  await prisma.dailyMenu.upsert({
    where: { date: tomorrowDate },
    update: {
      items: {
        deleteMany: {},
        create: createdItems.slice(0, 5).map((item) => ({ menuItemId: item.id })),
      },
    },
    create: {
      date: tomorrowDate,
      items: {
        create: createdItems.slice(0, 5).map((item) => ({ menuItemId: item.id })),
      },
    },
  });

  const monday = new Date();
  const delta = ((8 - monday.getDay()) % 7) || 7;
  monday.setDate(monday.getDate() + delta);
  monday.setHours(0, 0, 0, 0);
  const mondayDate = dbDateOnly(monday);
  const saturday = new Date(mondayDate);
  saturday.setDate(saturday.getDate() + 5);

  const weeklyTemplate = [
    ["MON_CHINH", ["1,1", "1,2", "1,3", "1,4", "1,5", "1,6"]],
    ["MAN_PHU", ["1,6"]],
    ["MON_CHAY_CHINH", ["1,7"]],
    ["MON_NUOC", ["1,8"]],
    ["TRANG_MIENG", ["TM"]],
  ].flatMap(([group, slots]) =>
    slots.flatMap((slot) =>
      Array.from({ length: 6 }, (_, dayIndex) => ({ group, slot, dayIndex, dishName: "" })),
    ),
  );

  const weeklySamples = [
    ["MON_CHINH", "1,1", ["Thịt kho tiêu", "Cá diêu hồng chiên", "Gà kho gừng", "Thịt kho trứng cút", "Tôm rim thịt", "Đậu hũ dồn thịt sốt cà"]],
    ["MON_CHINH", "1,2", ["Xíu mại sốt cà", "Sườn kho thơm", "Thịt chiên muối sả", "Cá ngừ chiên mắm", "Chả cá chiên", "Vịt kho sả ớt"]],
    ["MAN_PHU", "1,6", ["Rau luộc hoặc xào", "Rau luộc hoặc xào", "Rau luộc hoặc xào", "Rau luộc hoặc xào", "Rau luộc hoặc xào", "Rau luộc hoặc xào"]],
    ["MON_CHAY_CHINH", "1,7", ["Sườn non chay", "Rau củ xào", "Sườn non sả ớt", "Rau củ xào", "Đậu hũ chiên", "Nấm đùi gà kho tiêu"]],
    ["MON_NUOC", "1,8", ["Mì Quảng", "", "Phở gà", "", "Bún bò", ""]],
    ["TRANG_MIENG", "TM", ["Trái cây theo mùa", "Trái cây theo mùa", "Trái cây theo mùa", "Trái cây theo mùa", "Trái cây theo mùa", "Trái cây theo mùa"]],
  ];

  const categoryByGroup = {
    MON_CHINH: "MAN",
    MAN_PHU: "THEM",
    MON_CHAY_CHINH: "CHAY",
    MON_NUOC: "NUOC",
    TRANG_MIENG: "THEM",
  };

  for (const [group, , dishes] of weeklySamples) {
    for (const dishName of new Set(dishes.filter((dish) => dish && dish !== "-"))) {
      await prisma.menuItem.upsert({
        where: { name: dishName },
        update: {
          category: categoryByGroup[group] ?? "MAN",
          isAvailable: true,
        },
        create: {
          name: dishName,
          category: categoryByGroup[group] ?? "MAN",
          price: group === "TRANG_MIENG" || group === "MAN_PHU" ? 12000 : 35000,
        },
      });
    }
  }

  const sampleMap = new Map(
    weeklySamples.flatMap(([group, slot, dishes]) =>
      dishes.map((dishName, dayIndex) => [`${group}:${slot}:${dayIndex}`, dishName]),
    ),
  );
  const weeklyCells = weeklyTemplate.map((cell) => ({
    ...cell,
    dishName: sampleMap.get(`${cell.group}:${cell.slot}:${cell.dayIndex}`) ?? "",
  }));

  await prisma.weeklyMenu.upsert({
    where: { startDate: mondayDate },
    update: {
      title: `MENU TUẦN ${mondayDate.toLocaleDateString("vi-VN")} ~ ${saturday.toLocaleDateString("vi-VN")}`,
      endDate: saturday,
      cells: {
        deleteMany: {},
        create: weeklyCells,
      },
    },
    create: {
      title: `MENU TUẦN ${mondayDate.toLocaleDateString("vi-VN")} ~ ${saturday.toLocaleDateString("vi-VN")}`,
      startDate: mondayDate,
      endDate: saturday,
      cells: {
        create: weeklyCells,
      },
    },
  });

  console.log(`Đã seed tài khoản quản trị ${adminEmail} và dữ liệu menu mẫu.`);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
