export const orders = Array.from({ length: 30 }, (_, i) => ({
  id: `ORD-${1000 + i}`,
  name: `Customer ${i + 1}`,
  status: ["Pending", "Completed", "Cancelled"][i % 3],
  price: Math.floor(Math.random() * 500000),
  date: `2025-05-${(i % 30) + 1}`
}));