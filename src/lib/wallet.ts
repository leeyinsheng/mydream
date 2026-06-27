import { db } from "./db";

export async function getOrCreateWallet(userId: string) {
  return db.wallet.upsert({
    where: { userId },
    create: { userId, balance: 0 },
    update: {},
  });
}

export async function getWalletWithTransactions(userId: string) {
  const wallet = await getOrCreateWallet(userId);
  const transactions = await db.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return { wallet, transactions };
}

export async function createTransaction(
  userId: string,
  type: "deposit" | "withdraw" | "exchange",
  amount: number,
  description?: string
) {
  return db.$transaction(async (tx) => {
    const wallet = await tx.wallet.upsert({
      where: { userId },
      create: { userId, balance: 0 },
      update: {},
    });

    const trx = await tx.transaction.create({
      data: {
        userId,
        type,
        amount,
        description: description || "",
        walletId: wallet.id,
      },
    });

    if (type === "deposit") {
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: amount } },
      });
    } else if (type === "withdraw" || type === "exchange") {
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } },
      });
    }

    return trx;
  });
}
