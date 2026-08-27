import bcrypt from "bcrypt";
import { OrderStatus, UserRole } from "@prisma/client";
import { prisma } from "./prisma.js";

const DEFAULT_PASSWORD = "Senha@123";
const ORDERS_PER_RESTAURANT = 10;

type SeedProduct = {
  name: string;
  description: string;
  priceInCents: number;
  isAvailable: boolean;
};

type SeedRestaurant = {
  ownerName: string;
  ownerEmail: string;
  name: string;
  description: string;
  isOpen: boolean;
  products: SeedProduct[];
};

type CreatedProduct = {
  id: number;
  name: string;
  priceInCents: number;
};

type CreatedClient = {
  id: number;
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

async function createProducts(
  restaurantId: number,
  products: SeedProduct[],
): Promise<CreatedProduct[]> {
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

async function createOrders(
  restaurantId: number,
  products: CreatedProduct[],
  clients: CreatedClient[],
) {
  if (products.length === 0) {
    throw new Error("Não é possível criar pedidos sem produtos.");
  }

  if (clients.length === 0) {
    throw new Error("Não é possível criar pedidos sem clientes.");
  }

  const statuses = [
    OrderStatus.CREATED,
    OrderStatus.ACCEPTED,
    OrderStatus.PREPARING,
    OrderStatus.ON_THE_WAY,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELED,
  ];

  const orders = Array.from(
    { length: ORDERS_PER_RESTAURANT },
    (_, index) => {
      const client = clients[index % clients.length]!;
      const firstProduct = products[index % products.length]!;
      const secondProduct = products[(index + 1) % products.length]!;
      const status = statuses[index % statuses.length]!;

      const firstQuantity = (index % 3) + 1;
      const shouldAddSecondProduct = index % 2 === 0;

      const orderItems = [
        {
          productId: firstProduct.id,
          quantity: firstQuantity,
          priceInCents: firstProduct.priceInCents,
        },
      ];

      let totalInCents = firstProduct.priceInCents * firstQuantity;

      if (shouldAddSecondProduct) {
        orderItems.push({
          productId: secondProduct.id,
          quantity: 1,
          priceInCents: secondProduct.priceInCents,
        });

        totalInCents += secondProduct.priceInCents;
      }

      return prisma.order.create({
        data: {
          clientId: client.id,
          restaurantId,
          status,
          totalInCents,
          orderItems: {
            create: orderItems,
          },
        },
      });
    },
  );

  await Promise.all(orders);
}

const restaurantSeeds: SeedRestaurant[] = [
  {
    ownerName: "Dono Burger",
    ownerEmail: "burger@ghostkitchen.com",
    name: "Ghost Burger",
    description: "Hambúrgueres artesanais feitos sob demanda.",
    isOpen: true,
    products: [
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
    ],
  },

  {
    ownerName: "Dono Sushi",
    ownerEmail: "sushi@ghostkitchen.com",
    name: "Sushi Shadow",
    description: "Combinados japoneses para delivery.",
    isOpen: true,
    products: [
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
    ],
  },

  {
    ownerName: "Dono Pizza",
    ownerEmail: "pizza@ghostkitchen.com",
    name: "Pizza Night",
    description: "Pizzas clássicas e especiais.",
    isOpen: false,
    products: [
      {
        name: "Pizza Calabresa",
        description: "Calabresa com cebola.",
        priceInCents: 4590,
        isAvailable: true,
      },
      {
        name: "Pizza Quatro Queijos",
        description: "Mix especial de queijos.",
        priceInCents: 4990,
        isAvailable: false,
      },
      {
        name: "Pizza Margherita",
        description: "Tomate, mussarela e manjericão.",
        priceInCents: 4290,
        isAvailable: true,
      },
    ],
  },

  {
    ownerName: "Dono Marmita",
    ownerEmail: "marmita@ghostkitchen.com",
    name: "Marmita Express",
    description: "Comida brasileira simples e rápida.",
    isOpen: false,
    products: [
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
      {
        name: "Marmita Linguiça",
        description: "Arroz, feijão, linguiça e farofa.",
        priceInCents: 2290,
        isAvailable: true,
      },
    ],
  },

  {
    ownerName: "Dono Mexicano",
    ownerEmail: "mexicano@ghostkitchen.com",
    name: "El Fantasma",
    description: "Comida mexicana com muito sabor.",
    isOpen: true,
    products: [
      {
        name: "Burrito Carne",
        description: "Burrito recheado com carne e queijo.",
        priceInCents: 3290,
        isAvailable: true,
      },
      {
        name: "Tacos",
        description: "Três tacos de carne.",
        priceInCents: 2790,
        isAvailable: true,
      },
      {
        name: "Nachos",
        description: "Nachos com cheddar e guacamole.",
        priceInCents: 2390,
        isAvailable: true,
      },
    ],
  },

  {
    ownerName: "Dono Massa",
    ownerEmail: "massa@ghostkitchen.com",
    name: "Pasta House",
    description: "Massas italianas preparadas na hora.",
    isOpen: true,
    products: [
      {
        name: "Spaghetti Carbonara",
        description: "Massa com bacon, queijo e molho cremoso.",
        priceInCents: 3890,
        isAvailable: true,
      },
      {
        name: "Penne Bolonhesa",
        description: "Penne com molho bolonhesa.",
        priceInCents: 3490,
        isAvailable: true,
      },
      {
        name: "Fettuccine Alfredo",
        description: "Fettuccine com molho Alfredo.",
        priceInCents: 3790,
        isAvailable: false,
      },
    ],
  },

  {
    ownerName: "Dono Churrasco",
    ownerEmail: "churrasco@ghostkitchen.com",
    name: "Brasa Delivery",
    description: "Carnes e acompanhamentos preparados na brasa.",
    isOpen: true,
    products: [
      {
        name: "Picanha",
        description: "Picanha com arroz e farofa.",
        priceInCents: 5290,
        isAvailable: true,
      },
      {
        name: "Costela",
        description: "Costela assada lentamente.",
        priceInCents: 4890,
        isAvailable: true,
      },
      {
        name: "Frango na Brasa",
        description: "Frango grelhado com acompanhamentos.",
        priceInCents: 3290,
        isAvailable: true,
      },
    ],
  },

  {
    ownerName: "Dono Vegano",
    ownerEmail: "vegano@ghostkitchen.com",
    name: "Green Kitchen",
    description: "Refeições vegetais frescas e nutritivas.",
    isOpen: true,
    products: [
      {
        name: "Burger Vegano",
        description: "Hambúrguer vegetal com salada.",
        priceInCents: 2990,
        isAvailable: true,
      },
      {
        name: "Bowl Verde",
        description: "Grãos, vegetais e molho especial.",
        priceInCents: 2690,
        isAvailable: true,
      },
      {
        name: "Wrap Vegano",
        description: "Wrap recheado com vegetais.",
        priceInCents: 2290,
        isAvailable: false,
      },
    ],
  },

  {
    ownerName: "Dono Árabe",
    ownerEmail: "arabe@ghostkitchen.com",
    name: "Beirut Express",
    description: "Especialidades da culinária árabe.",
    isOpen: false,
    products: [
      {
        name: "Shawarma",
        description: "Carne temperada com salada e molho.",
        priceInCents: 2990,
        isAvailable: true,
      },
      {
        name: "Kibe",
        description: "Porção com seis unidades.",
        priceInCents: 2190,
        isAvailable: true,
      },
      {
        name: "Esfiha",
        description: "Esfihas abertas variadas.",
        priceInCents: 1990,
        isAvailable: true,
      },
    ],
  },

  {
    ownerName: "Dono Frango",
    ownerEmail: "frango@ghostkitchen.com",
    name: "Chicken Point",
    description: "Frango crocante e acompanhamentos.",
    isOpen: true,
    products: [
      {
        name: "Bucket Frango",
        description: "Balde de frango crocante.",
        priceInCents: 4290,
        isAvailable: true,
      },
      {
        name: "Chicken Burger",
        description: "Sanduíche de frango empanado.",
        priceInCents: 2690,
        isAvailable: true,
      },
      {
        name: "Chicken Wings",
        description: "Asinhas com molho especial.",
        priceInCents: 2990,
        isAvailable: false,
      },
    ],
  },

  {
    ownerName: "Dono Açaí",
    ownerEmail: "acai@ghostkitchen.com",
    name: "Açaí Wave",
    description: "Açaí, frutas e complementos.",
    isOpen: true,
    products: [
      {
        name: "Açaí 300ml",
        description: "Açaí com banana e granola.",
        priceInCents: 1890,
        isAvailable: true,
      },
      {
        name: "Açaí 500ml",
        description: "Açaí com até três complementos.",
        priceInCents: 2490,
        isAvailable: true,
      },
      {
        name: "Açaí 700ml",
        description: "Açaí grande com complementos.",
        priceInCents: 3190,
        isAvailable: true,
      },
    ],
  },

  {
    ownerName: "Dono Pastel",
    ownerEmail: "pastel@ghostkitchen.com",
    name: "Pastel Mania",
    description: "Pastéis crocantes preparados na hora.",
    isOpen: false,
    products: [
      {
        name: "Pastel Carne",
        description: "Pastel recheado com carne.",
        priceInCents: 1290,
        isAvailable: true,
      },
      {
        name: "Pastel Queijo",
        description: "Pastel recheado com queijo.",
        priceInCents: 1190,
        isAvailable: true,
      },
      {
        name: "Pastel Pizza",
        description: "Queijo, tomate e orégano.",
        priceInCents: 1390,
        isAvailable: true,
      },
    ],
  },

  {
    ownerName: "Dono Mineiro",
    ownerEmail: "mineiro@ghostkitchen.com",
    name: "Cantinho Mineiro",
    description: "Comida mineira tradicional.",
    isOpen: true,
    products: [
      {
        name: "Feijão Tropeiro",
        description: "Feijão tropeiro com acompanhamentos.",
        priceInCents: 3290,
        isAvailable: true,
      },
      {
        name: "Frango com Quiabo",
        description: "Frango com quiabo e arroz.",
        priceInCents: 3490,
        isAvailable: true,
      },
      {
        name: "Torresmo",
        description: "Porção de torresmo crocante.",
        priceInCents: 2290,
        isAvailable: false,
      },
    ],
  },

  {
    ownerName: "Dono Nordestino",
    ownerEmail: "nordestino@ghostkitchen.com",
    name: "Sabor do Nordeste",
    description: "Pratos típicos nordestinos.",
    isOpen: true,
    products: [
      {
        name: "Baião de Dois",
        description: "Arroz, feijão e queijo coalho.",
        priceInCents: 3390,
        isAvailable: true,
      },
      {
        name: "Carne de Sol",
        description: "Carne de sol com mandioca.",
        priceInCents: 4290,
        isAvailable: true,
      },
      {
        name: "Escondidinho",
        description: "Escondidinho de carne seca.",
        priceInCents: 3690,
        isAvailable: true,
      },
    ],
  },

  {
    ownerName: "Dono Chinês",
    ownerEmail: "chines@ghostkitchen.com",
    name: "Dragon Wok",
    description: "Pratos orientais preparados no wok.",
    isOpen: false,
    products: [
      {
        name: "Yakissoba",
        description: "Macarrão, legumes e carne.",
        priceInCents: 3290,
        isAvailable: true,
      },
      {
        name: "Frango Xadrez",
        description: "Frango com legumes e molho oriental.",
        priceInCents: 3490,
        isAvailable: true,
      },
      {
        name: "Rolinho Primavera",
        description: "Porção de rolinhos primavera.",
        priceInCents: 1890,
        isAvailable: false,
      },
    ],
  },

  {
    ownerName: "Dono Hot Dog",
    ownerEmail: "hotdog@ghostkitchen.com",
    name: "Dog Station",
    description: "Hot dogs completos e porções.",
    isOpen: true,
    products: [
      {
        name: "Dog Tradicional",
        description: "Salsicha, molho, milho e batata palha.",
        priceInCents: 1790,
        isAvailable: true,
      },
      {
        name: "Dog Bacon",
        description: "Hot dog com bacon e cheddar.",
        priceInCents: 2190,
        isAvailable: true,
      },
      {
        name: "Dog Duplo",
        description: "Duas salsichas e queijo.",
        priceInCents: 2390,
        isAvailable: true,
      },
    ],
  },

  {
    ownerName: "Dono Crepe",
    ownerEmail: "crepe@ghostkitchen.com",
    name: "Crepe Corner",
    description: "Crepes doces e salgados.",
    isOpen: true,
    products: [
      {
        name: "Crepe Frango",
        description: "Frango com requeijão.",
        priceInCents: 2190,
        isAvailable: true,
      },
      {
        name: "Crepe Presunto e Queijo",
        description: "Presunto, queijo e tomate.",
        priceInCents: 1990,
        isAvailable: true,
      },
      {
        name: "Crepe Chocolate",
        description: "Chocolate com morango.",
        priceInCents: 2290,
        isAvailable: false,
      },
    ],
  },

  {
    ownerName: "Dono Poke",
    ownerEmail: "poke@ghostkitchen.com",
    name: "Poke Ocean",
    description: "Pokes frescos e personalizados.",
    isOpen: false,
    products: [
      {
        name: "Poke Salmão",
        description: "Salmão, arroz japonês e vegetais.",
        priceInCents: 3990,
        isAvailable: true,
      },
      {
        name: "Poke Atum",
        description: "Atum, arroz e acompanhamentos.",
        priceInCents: 3890,
        isAvailable: true,
      },
      {
        name: "Poke Frango",
        description: "Frango grelhado, arroz e vegetais.",
        priceInCents: 3290,
        isAvailable: true,
      },
    ],
  },

  {
    ownerName: "Dono Sobremesa",
    ownerEmail: "sobremesa@ghostkitchen.com",
    name: "Sweet Ghost",
    description: "Sobremesas para todos os momentos.",
    isOpen: true,
    products: [
      {
        name: "Brownie",
        description: "Brownie de chocolate.",
        priceInCents: 1490,
        isAvailable: true,
      },
      {
        name: "Cheesecake",
        description: "Cheesecake com frutas vermelhas.",
        priceInCents: 1890,
        isAvailable: true,
      },
      {
        name: "Petit Gateau",
        description: "Petit gateau com sorvete.",
        priceInCents: 2290,
        isAvailable: false,
      },
    ],
  },

  {
    ownerName: "Dono Café",
    ownerEmail: "cafe@ghostkitchen.com",
    name: "Coffee Cloud",
    description: "Cafés, lanches e doces.",
    isOpen: true,
    products: [
      {
        name: "Cappuccino",
        description: "Café espresso com leite e espuma.",
        priceInCents: 1290,
        isAvailable: true,
      },
      {
        name: "Croissant",
        description: "Croissant amanteigado.",
        priceInCents: 1390,
        isAvailable: true,
      },
      {
        name: "Sanduíche Natural",
        description: "Frango, salada e molho especial.",
        priceInCents: 1890,
        isAvailable: true,
      },
    ],
  },
];

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Seed não pode ser executada em produção.");
  }

  console.log("Limpando banco de dados...");
  await clearDatabase();

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12);

  console.log("Criando clientes...");

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

  const clients = [clientAna, clientBruno];

  console.log("Criando restaurantes, produtos e pedidos...");

  for (const restaurantSeed of restaurantSeeds) {
    const owner = await prisma.user.create({
      data: {
        name: restaurantSeed.ownerName,
        email: restaurantSeed.ownerEmail,
        passwordHash,
        role: UserRole.RESTAURANT,
      },
    });

    const restaurant = await prisma.restaurant.create({
      data: {
        userId: owner.id,
        name: restaurantSeed.name,
        description: restaurantSeed.description,
        isOpen: restaurantSeed.isOpen,
      },
    });

    const products = await createProducts(
      restaurant.id,
      restaurantSeed.products,
    );

    await createOrders(restaurant.id, products, clients);

    console.log(
      `✓ ${restaurant.name}: ${products.length} produtos e ${ORDERS_PER_RESTAURANT} pedidos`,
    );
  }

  console.log("");
  console.log("Seed finalizada com sucesso.");
  console.log(`Restaurantes: ${restaurantSeeds.length}`);
  console.log(
    `Pedidos: ${restaurantSeeds.length * ORDERS_PER_RESTAURANT}`,
  );
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