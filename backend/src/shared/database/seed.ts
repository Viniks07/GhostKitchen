import bcrypt from "bcrypt";

import { prisma } from "./prisma.js";

const PASSWORD = "12345678";

type CategorySlug =
  | "lanches"
  | "pizzas"
  | "brasileira"
  | "sobremesa"
  | "asiatica";

type SeedCategory = {
  name: string;
  slug: CategorySlug;
};

type SeedProduct = {
  name: string;
  description: string;
  priceInCents: number;
};

const categories: SeedCategory[] = [
  {
    name: "Lanches",
    slug: "lanches",
  },
  {
    name: "Pizzas",
    slug: "pizzas",
  },
  {
    name: "Brasileira",
    slug: "brasileira",
  },
  {
    name: "Sobremesa",
    slug: "sobremesa",
  },
  {
    name: "Asiática",
    slug: "asiatica",
  },
];

const restaurantNamesByCategory: Record<CategorySlug, string[]> = {
  lanches: [
    "Ghost Burger",
    "Burger da Esquina",
    "Smash House",
    "Brasa Burger",
    "Lanche Urbano",
    "Ponto do Hambúrguer",
    "Sanduba Express",
    "Burger Prime",
    "Big Bite",
    "Snack Garage",
  ],
  pizzas: [
    "Forno Ghost",
    "Pizza Nostra",
    "Bella Massa",
    "Pizzaria Central",
    "Forno de Pedra",
    "Mamma Pizza",
    "Massa Fina",
    "Pizza do Bairro",
    "La Redonda",
    "Cantina da Pizza",
  ],
  brasileira: [
    "Tempero Brasileiro",
    "Casa do Prato Feito",
    "Sabor da Terra",
    "Panela de Ferro",
    "Fogão Caseiro",
    "Brasil na Mesa",
    "Cantinho Mineiro",
    "Cozinha do Norte",
    "Prato da Vila",
    "Raiz Brasileira",
  ],
  sobremesa: [
    "Doce Ghost",
    "Brownie House",
    "Açúcar & Cacau",
    "Gelato Prime",
    "Confeitaria Central",
    "Bolo da Casa",
    "Doce Momento",
    "Pudim Lab",
    "Cookie Station",
    "Sobremesas da Vila",
  ],
  asiatica: [
    "Tokyo Bowl",
    "Sushi Ghost",
    "Noodle House",
    "Wok Express",
    "Casa Oriental",
    "Ramen Station",
    "Asia Prime",
    "Sakura Food",
    "Thai Urban",
    "Dragon Kitchen",
  ],
};

const productsByCategory: Record<CategorySlug, SeedProduct[]> = {
  lanches: [
    {
      name: "Smash Burger",
      description: "Pão brioche, carne smash, queijo e molho especial.",
      priceInCents: 2890,
    },
    {
      name: "Cheeseburger Clássico",
      description: "Hambúrguer, queijo, alface, tomate e maionese.",
      priceInCents: 2490,
    },
    {
      name: "Chicken Burger",
      description: "Frango empanado, queijo, alface e molho da casa.",
      priceInCents: 2690,
    },
    {
      name: "Duplo Bacon",
      description: "Dois burgers, queijo cheddar, bacon e molho barbecue.",
      priceInCents: 3490,
    },
    {
      name: "Sanduíche de Pernil",
      description: "Pernil desfiado, vinagrete e molho especial.",
      priceInCents: 2590,
    },
    {
      name: "X-Salada",
      description: "Hambúrguer, queijo, presunto, alface, tomate e milho.",
      priceInCents: 2790,
    },
    {
      name: "X-Bacon",
      description: "Hambúrguer, queijo, bacon, alface e tomate.",
      priceInCents: 2990,
    },
    {
      name: "Batata Frita",
      description: "Porção de batata frita crocante.",
      priceInCents: 1590,
    },
    {
      name: "Onion Rings",
      description: "Anéis de cebola empanados.",
      priceInCents: 1790,
    },
    {
      name: "Combo Burger",
      description: "Burger, batata frita e refrigerante.",
      priceInCents: 3990,
    },
  ],
  pizzas: [
    {
      name: "Pizza Margherita",
      description: "Molho de tomate, muçarela, tomate e manjericão.",
      priceInCents: 4590,
    },
    {
      name: "Pizza Calabresa",
      description: "Calabresa, cebola, muçarela e orégano.",
      priceInCents: 4790,
    },
    {
      name: "Pizza Portuguesa",
      description: "Presunto, ovos, cebola, ervilha, muçarela e azeitona.",
      priceInCents: 5290,
    },
    {
      name: "Pizza Quatro Queijos",
      description: "Muçarela, parmesão, provolone e gorgonzola.",
      priceInCents: 5590,
    },
    {
      name: "Pizza Frango com Catupiry",
      description: "Frango desfiado, catupiry e milho.",
      priceInCents: 5490,
    },
    {
      name: "Pizza Pepperoni",
      description: "Pepperoni, muçarela e molho de tomate.",
      priceInCents: 5790,
    },
    {
      name: "Pizza Bacon",
      description: "Bacon, muçarela, cebola e orégano.",
      priceInCents: 5490,
    },
    {
      name: "Pizza Vegetariana",
      description: "Legumes, muçarela, tomate e azeitona.",
      priceInCents: 4990,
    },
    {
      name: "Pizza Chocolate",
      description: "Massa doce com chocolate e granulado.",
      priceInCents: 4590,
    },
    {
      name: "Pizza Meio a Meio",
      description: "Escolha dois sabores da casa.",
      priceInCents: 5990,
    },
  ],
  brasileira: [
    {
      name: "Prato Feito de Frango",
      description: "Arroz, feijão, frango grelhado, salada e batata.",
      priceInCents: 2990,
    },
    {
      name: "Prato Feito de Carne",
      description: "Arroz, feijão, carne acebolada, salada e farofa.",
      priceInCents: 3290,
    },
    {
      name: "Feijoada",
      description: "Feijoada com arroz, couve, farofa e laranja.",
      priceInCents: 4290,
    },
    {
      name: "Strogonoff de Frango",
      description: "Strogonoff, arroz e batata palha.",
      priceInCents: 3490,
    },
    {
      name: "Parmegiana de Carne",
      description: "Filé à parmegiana com arroz e fritas.",
      priceInCents: 4490,
    },
    {
      name: "Escondidinho de Carne Seca",
      description: "Purê de mandioca com carne seca desfiada.",
      priceInCents: 3890,
    },
    {
      name: "Moqueca de Peixe",
      description: "Peixe ao molho com arroz e pirão.",
      priceInCents: 4990,
    },
    {
      name: "Virado à Paulista",
      description: "Arroz, tutu, bisteca, couve, ovo e banana.",
      priceInCents: 4590,
    },
    {
      name: "Frango à Milanesa",
      description: "Frango empanado com arroz, feijão e salada.",
      priceInCents: 3190,
    },
    {
      name: "Baião de Dois",
      description: "Arroz, feijão, queijo coalho e carne seca.",
      priceInCents: 3790,
    },
  ],
  sobremesa: [
    {
      name: "Brownie de Chocolate",
      description: "Brownie denso com chocolate meio amargo.",
      priceInCents: 1690,
    },
    {
      name: "Pudim",
      description: "Pudim de leite condensado com calda de caramelo.",
      priceInCents: 1490,
    },
    {
      name: "Bolo de Cenoura",
      description: "Fatia de bolo de cenoura com cobertura de chocolate.",
      priceInCents: 1590,
    },
    {
      name: "Cheesecake",
      description: "Cheesecake com calda de frutas vermelhas.",
      priceInCents: 2190,
    },
    {
      name: "Cookie Recheado",
      description: "Cookie artesanal com recheio cremoso.",
      priceInCents: 1290,
    },
    {
      name: "Mousse de Chocolate",
      description: "Mousse cremosa de chocolate.",
      priceInCents: 1390,
    },
    {
      name: "Torta de Limão",
      description: "Torta de limão com merengue.",
      priceInCents: 1890,
    },
    {
      name: "Açaí 500ml",
      description: "Açaí com banana, granola e leite condensado.",
      priceInCents: 2490,
    },
    {
      name: "Sorvete Artesanal",
      description: "Duas bolas de sorvete artesanal.",
      priceInCents: 1790,
    },
    {
      name: "Combo Doces",
      description: "Brownie, cookie e mousse.",
      priceInCents: 3490,
    },
  ],
  asiatica: [
    {
      name: "Sushi Combo",
      description: "Combinado com 16 peças variadas.",
      priceInCents: 4990,
    },
    {
      name: "Temaki Salmão",
      description: "Temaki com salmão, arroz e cream cheese.",
      priceInCents: 2890,
    },
    {
      name: "Yakissoba",
      description: "Macarrão oriental com legumes e carne.",
      priceInCents: 3790,
    },
    {
      name: "Ramen",
      description: "Caldo oriental com macarrão, ovo e carne suína.",
      priceInCents: 4290,
    },
    {
      name: "Frango Xadrez",
      description: "Frango com legumes e molho oriental.",
      priceInCents: 3590,
    },
    {
      name: "Guioza",
      description: "Pastéis orientais recheados e grelhados.",
      priceInCents: 2290,
    },
    {
      name: "Hot Roll",
      description: "Sushi empanado com salmão e cream cheese.",
      priceInCents: 3290,
    },
    {
      name: "Poke Salmão",
      description: "Arroz, salmão, legumes e molho especial.",
      priceInCents: 4490,
    },
    {
      name: "Pad Thai",
      description: "Macarrão de arroz com legumes, ovo e amendoim.",
      priceInCents: 4190,
    },
    {
      name: "Combo Oriental",
      description: "Yakissoba, guioza e rolinho primavera.",
      priceInCents: 5490,
    },
  ],
};

async function clearDatabase() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.session.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
}

async function seedCategories() {
  const categoryIdBySlug = {} as Record<CategorySlug, number>;

  for (const category of categories) {
    const createdCategory = await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
      },
    });

    categoryIdBySlug[category.slug] = createdCategory.id;
  }

  return categoryIdBySlug;
}

async function seedClientUser(passwordHash: string) {
  await prisma.user.create({
    data: {
      name: "Cliente Demo",
      email: "cliente@ghostkitchen.com",
      passwordHash,
      role: "CLIENT",
      addresses: {
        create: {
          street: "Rua das Flores",
          number: "123",
          city: "São Paulo",
          state: "SP",
          zipCode: "01000-000",
        },
      },
    },
  });
}

async function seedRestaurants(
  passwordHash: string,
  categoryIdBySlug: Record<CategorySlug, number>,
) {
  let restaurantCount = 0;
  let productCount = 0;

  for (const category of categories) {
    const restaurantNames = restaurantNamesByCategory[category.slug];
    const products = productsByCategory[category.slug];

    for (const restaurantName of restaurantNames) {
      restaurantCount += 1;

      const user = await prisma.user.create({
        data: {
          name: `Dono ${restaurantName}`,
          email: `restaurante${restaurantCount}@ghostkitchen.com`,
          passwordHash,
          role: "RESTAURANT",
        },
      });

      const restaurant = await prisma.restaurant.create({
        data: {
          userId: user.id,
          categoryId: categoryIdBySlug[category.slug],
          name: restaurantName,
          description: `${restaurantName} - restaurante da categoria ${category.name}.`,
          isOpen: restaurantCount % 4 !== 0,
        },
      });

      await prisma.product.createMany({
        data: products.map((product, productIndex) => ({
          restaurantId: restaurant.id,
          name: product.name,
          description: product.description,
          priceInCents: product.priceInCents,
          isAvailable: productIndex % 5 !== 0,
        })),
      });

      productCount += products.length;
    }
  }

  return {
    restaurantCount,
    productCount,
  };
}

async function main() {
  console.log("Limpando banco...");

  await clearDatabase();

  console.log("Criando hash da senha...");

  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  console.log("Criando categorias...");

  const categoryIdBySlug = await seedCategories();

  console.log("Criando usuário cliente...");

  await seedClientUser(passwordHash);

  console.log("Criando restaurantes e produtos...");

  const { restaurantCount, productCount } = await seedRestaurants(
    passwordHash,
    categoryIdBySlug,
  );

  console.log("Seed finalizada com sucesso.");
  console.log(`Categorias criadas: ${categories.length}`);
  console.log(`Restaurantes criados: ${restaurantCount}`);
  console.log(`Produtos criados: ${productCount}`);
  console.log("Senha padrão dos usuários demo: 12345678");
  console.log("Cliente demo: cliente@ghostkitchen.com");
  console.log(
    "Restaurantes demo: restaurante1@ghostkitchen.com até restaurante50@ghostkitchen.com",
  );
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
