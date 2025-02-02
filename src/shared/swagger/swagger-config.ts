import { paymentSwagger } from "@/modules/payment/swagger/payment.swagger";
import { balanceSwagger } from "@/modules/balance/swagger/balance.swagger";
import { expenseSwagger } from "@/modules/expense/swagger/expense.swagger";
import { groupSwagger } from "@/modules/group/swagger/group.swagger";
import { memberSwagger } from "@/modules/member/swagger/member.swagger";
import { applicationConfig } from "@/config";

export const swaggerConfig = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "Comprehensive documentation for all API endpoints",
  },
  servers: [
    {
      url: `http://localhost:${applicationConfig.port}`,
      description: "Local server",
    },
  ],
  tags: [
    ...paymentSwagger.tags,
    ...balanceSwagger.tags,
    ...expenseSwagger.tags,
    ...groupSwagger.tags,
    ...memberSwagger.tags,
  ],
  paths: {
    ...paymentSwagger.paths,
    ...balanceSwagger.paths,
    ...expenseSwagger.paths,
    ...groupSwagger.paths,
    ...memberSwagger.paths,
  },
};
