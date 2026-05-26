import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { env } from "../config/env.schema";
import { PrismaClient } from "../../generated/prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private static pool: Pool;

  constructor() {
    // 1. Initialize the PostgreSQL connection pool
    const pool = new Pool({
      connectionString: env.DATABASE_URL,
    });

    // 2. Instantiate the explicit PrismaPg adapter
    const adapter = new PrismaPg(pool);

    // 3. Pass the adapter instance inside the configuration options object
    super({
      adapter: adapter,
    });

    PrismaService.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await PrismaService.pool.end();
  }
}
