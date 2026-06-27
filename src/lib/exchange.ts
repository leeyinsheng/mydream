import { db } from "./db";

export async function getProducts() {
  return db.exchangeProduct.findMany({
    where: { status: "active", stock: { not: 0 } },
    include: { partner: true },
    orderBy: { pointsCost: "asc" },
  });
}

export async function getProductById(id: string) {
  return db.exchangeProduct.findUnique({
    where: { id },
    include: { partner: true },
  });
}

export async function createExchangeOrder(
  userId: string,
  productId: string,
  pointsSpent: number
) {
  return db.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet || wallet.balance < pointsSpent) {
      throw new Error("Insufficient balance");
    }

    const product = await tx.exchangeProduct.findUnique({ where: { id: productId } });
    if (!product || product.status !== "active") {
      throw new Error("Product unavailable");
    }
    if (product.stock === 0) {
      throw new Error("Out of stock");
    }

    const codePrefix = product.partnerId.slice(0, 4).toUpperCase();
    const redemptionCode = `FV-${codePrefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const order = await tx.exchangeOrder.create({
      data: {
        userId,
        productId,
        pointsSpent,
        redemptionCode,
        status: "completed",
      },
    });

    await tx.wallet.update({
      where: { userId },
      data: { balance: { decrement: pointsSpent } },
    });

    await tx.transaction.create({
      data: {
        userId,
        type: "exchange",
        amount: -pointsSpent,
        description: `兌換：${product.name}`,
        walletId: wallet.id,
      },
    });

    if (product.stock > 0) {
      await tx.exchangeProduct.update({
        where: { id: productId },
        data: { stock: { decrement: 1 } },
      });
    }

    return order;
  });
}

export async function getUserOrders(userId: string) {
  return db.exchangeOrder.findMany({
    where: { userId },
    include: { product: { include: { partner: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getPartners() {
  return db.partner.findMany({
    include: { products: true },
    orderBy: { createdAt: "desc" },
  });
}
