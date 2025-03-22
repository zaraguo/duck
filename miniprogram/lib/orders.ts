import type { Order } from "./types"

export const orders: Order[] = [
  {
    id: "ORD-001",
    customer: "张三",
    date: "2023-06-15",
    items: [
      {
        id: "1",
        name: "24K金项链",
        price: 3999.99,
        quantity: 1,
      },
    ],
    total: 3999.99,
    status: "completed",
  },
  {
    id: "ORD-002",
    customer: "李四",
    date: "2023-06-18",
    items: [
      {
        id: "2",
        name: "18K金戒指",
        price: 2499.99,
        quantity: 1,
      },
      {
        id: "4",
        name: "玫瑰金项链",
        price: 1999.99,
        quantity: 1,
      },
    ],
    total: 4499.98,
    status: "shipped",
  },
  {
    id: "ORD-003",
    customer: "王五",
    date: "2023-06-20",
    items: [
      {
        id: "5",
        name: "钻石戒指",
        price: 9999.99,
        quantity: 1,
      },
    ],
    total: 9999.99,
    status: "processing",
  },
  {
    id: "ORD-004",
    customer: "赵六",
    date: "2023-06-22",
    items: [
      {
        id: "3",
        name: "足金手镯",
        price: 5999.99,
        quantity: 1,
      },
    ],
    total: 5999.99,
    status: "pending",
  },
  {
    id: "ORD-005",
    customer: "钱七",
    date: "2023-06-25",
    items: [
      {
        id: "7",
        name: "白金项链",
        price: 4599.99,
        quantity: 1,
      },
      {
        id: "8",
        name: "金镶玉戒指",
        price: 3299.99,
        quantity: 1,
      },
    ],
    total: 7899.98,
    status: "cancelled",
  },
]

