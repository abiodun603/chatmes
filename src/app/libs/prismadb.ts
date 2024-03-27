import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== 'production') globalThis.prisma = client

export default client;

/**
 * Import:

1. import { PrismaClient } from "@prisma/client";: This line imports the PrismaClient class from the @prisma/client package, which allows you to interact with your Prisma database.
Global Declaration:

2. declare global { ... }: This block declares a global variable called prisma of type PrismaClient | undefined. This tells TypeScript that a variable named prisma might exist globally and could be either a PrismaClient instance or undefined.
Client Initialization:

3. const client = globalThis.prisma || new PrismaClient();: This line creates a constant named client. It first checks if a global variable named prisma already exists using the globalThis.prisma expression.
If globalThis.prisma exists, it's assigned to the client constant. This means you've likely already created a Prisma Client instance elsewhere in your application and want to reuse it here.
If globalThis.prisma doesn't exist, a new PrismaClient instance is created using new PrismaClient() and assigned to the client constant.
Singleton Pattern (Optional):

4. if(process.env.NODE_ENV !== 'production') globalThis.prisma = client: This conditional statement is only executed if you're not in a production environment (based on the NODE_ENV environment variable). Inside the condition:
globalThis.prisma = client: This line assigns the created client (Prisma Client instance) to the global prisma variable. This creates a singleton pattern, ensuring there's only one instance of the Prisma Client throughout your application (excluding production for potential performance reasons).
 */