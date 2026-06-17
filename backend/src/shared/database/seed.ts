import bcrypt from "bcrypt";
import { OrderStatus, UserRole } from "@prisma/client";
import { prisma } from "./prisma.js";

const DEFAULT_PASSWORD = "Senha@123";

type SeedProduct = {
  name: string;
  description: string;
  priceInCents: number;
  isAvailable: boolean;
};

type CreatedProduct = {
  id: number;
  name: string;
  priceInCents: number;
};

async function clearDatabase() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.session.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();
}

async function createProducts(restaurantId: number, products: SeedProduct[]) {
  return Promise.all(
    products.map((product) =>
      prisma.product.create({
        data: {
          restaurantId,
          name: product.name,
          description: product.description,
          priceInCents: product.priceInCents,
          isAvailable: product.isAvailable,
        },
      }),
    ),
  );
}

function findProduct(products: CreatedProduct[], name: string) {
  const product = products.find((item) => item.name === name);

  if (!product) {
    throw new Error(`Produto não encontrado na seed: ${name}`);
  }

  return product;
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Seed não pode ser executada em produção.");
  }

  console.log("Limpando banco de dados...");
  await clearDatabase();

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12);

  console.log("Criando usuários...");

  const clientAna = await prisma.user.create({
    data: {
      name: "Ana Cliente",
      email: "ana.cliente@ghostkitchen.com",
      passwordHash,
      role: UserRole.CLIENT,
    },
  });

  const clientBruno = await prisma.user.create({
    data: {
      name: "Bruno Cliente",
      email: "bruno.cliente@ghostkitchen.com",
      passwordHash,
      role: UserRole.CLIENT,
    },
  });

  await prisma.address.createMany({
    data: [
      {
        userId: clientAna.id,
        street: "Rua das Flores",
        number: "123",
        city: "Arapongas",
        state: "PR",
        zipCode: "86700000",
      },
      {
        userId: clientBruno.id,
        street: "Avenida Central",
        number: "456",
        city: "Londrina",
        state: "PR",
        zipCode: "86000000",
      },
    ],
  });

  const burgerOwner = await prisma.user.create({
    data: {
      name: "Dono Burger",
      email: "burger@ghostkitchen.com",
      passwordHash,
      role: UserRole.RESTAURANT,
    },
  });

  const sushiOwner = await prisma.user.create({
    data: {
      name: "Dono Sushi",
      email: "sushi@ghostkitchen.com",
      passwordHash,
      role: UserRole.RESTAURANT,
    },
  });

  const pizzaOwner = await prisma.user.create({
    data: {
      name: "Dono Pizza",
      email: "pizza@ghostkitchen.com",
      passwordHash,
      role: UserRole.RESTAURANT,
    },
  });

  const marmitaOwner = await prisma.user.create({
    data: {
      name: "Dono Marmita",
      email: "marmita@ghostkitchen.com",
      passwordHash,
      role: UserRole.RESTAURANT,
    },
  });

  console.log("Criando restaurantes...");

  const burgerRestaurant = await prisma.restaurant.create({
    data: {
      userId: burgerOwner.id,
      name: "Ghost Burger",
      description: "Hambúrgueres artesanais feitos sob demanda.",
      isOpen: true,
    },
  });

  const sushiRestaurant = await prisma.restaurant.create({
    data: {
      userId: sushiOwner.id,
      name: "Sushi Shadow",
      description: "Combinados japoneses para delivery.",
      isOpen: true,
    },
  });

  const pizzaRestaurant = await prisma.restaurant.create({
    data: {
      userId: pizzaOwner.id,
      name: "Pizza Night",
      description: "Pizzas clássicas e especiais.",
      isOpen: false,
    },
  });

  const marmitaRestaurant = await prisma.restaurant.create({
    data: {
      userId: marmitaOwner.id,
      name: "Marmita Express",
      description: "Comida brasileira simples e rápida.",
      isOpen: false,
    },
  });

  console.log("Criando produtos...");

  const burgerProducts = await createProducts(burgerRestaurant.id, [
    {
      name: "Ghost Burger",
      description: "Burger com queijo, bacon e molho especial.",
      priceInCents: 2890,
      isAvailable: true,
    },
    {
      name: "Batata Fantasma",
      description: "Batata frita crocante com cheddar.",
      priceInCents: 1490,
      isAvailable: true,
    },
    {
      name: "Milkshake Sombrio",
      description: "Milkshake de chocolate.",
      priceInCents: 1890,
      isAvailable: false,
    },
  ]);

  const sushiProducts = await createProducts(sushiRestaurant.id, [
    {
      name: "Combo Sushi 20 peças",
      description: "Seleção de sushis variados.",
      priceInCents: 4990,
      isAvailable: true,
    },
    {
      name: "Temaki Salmão",
      description: "Temaki de salmão com cream cheese.",
      priceInCents: 2390,
      isAvailable: true,
    },
    {
      name: "Hot Roll",
      description: "Hot roll crocante.",
      priceInCents: 2690,
      isAvailable: false,
    },
  ]);

  await createProducts(pizzaRestaurant.id, [
    {
      name: "Pizza Calabresa",
      description: "Pizza de calabresa com cebola.",
      priceInCents: 4590,
      isAvailable: true,
    },
    {
      name: "Pizza Quatro Queijos",
      description: "Pizza com mix de queijos.",
      priceInCents: 4990,
      isAvailable: false,
    },
  ]);

  await createProducts(marmitaRestaurant.id, [
    {
      name: "Marmita Frango",
      description: "Arroz, feijão, frango e salada.",
      priceInCents: 2190,
      isAvailable: true,
    },
    {
      name: "Marmita Bife",
      description: "Arroz, feijão, bife e legumes.",
      priceInCents: 2490,
      isAvailable: false,
    },
  ]);

  console.log("Criando pedidos...");

  const ghostBurger = findProduct(burgerProducts, "Ghost Burger");
  const batataFantasma = findProduct(burgerProducts, "Batata Fantasma");

  await prisma.order.create({
    data: {
      clientId: clientAna.id,
      restaurantId: burgerRestaurant.id,
      status: OrderStatus.PREPARING,
      totalInCents: ghostBurger.priceInCents * 2 + batataFantasma.priceInCents,
      orderItems: {
        create: [
          {
            productId: ghostBurger.id,
            quantity: 2,
            priceInCents: ghostBurger.priceInCents,
          },
          {
            productId: batataFantasma.id,
            quantity: 1,
            priceInCents: batataFantasma.priceInCents,
          },
        ],
      },
    },
  });

  const comboSushi = findProduct(sushiProducts, "Combo Sushi 20 peças");

  await prisma.order.create({
    data: {
      clientId: clientBruno.id,
      restaurantId: sushiRestaurant.id,
      status: OrderStatus.DELIVERED,
      totalInCents: comboSushi.priceInCents,
      orderItems: {
        create: [
          {
            productId: comboSushi.id,
            quantity: 1,
            priceInCents: comboSushi.priceInCents,
          },
        ],
      },
    },
  });

  console.log("Seed finalizada com sucesso.");
  console.log(`Senha padrão dos usuários: ${DEFAULT_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
