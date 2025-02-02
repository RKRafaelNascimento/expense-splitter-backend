export const paymentSwagger = {
  tags: [
    {
      name: "Payment",
      description:
        "Endpoints for payment operations, including paying an expense.",
    },
  ],
  paths: {
    "/payment": {
      post: {
        tags: ["Payment"],
        summary: "Pay an expense",
        description:
          "Marks an expense as paid by transferring money from the payer to the expense creator, updating the expense split and the expense status, and sending a notification.",
        parameters: [
          {
            name: "group_id",
            in: "header",
            required: true,
            description: "ID of the group, injected by middleware.",
            schema: {
              type: "integer",
              example: 1,
            },
          },
          {
            name: "member_id",
            in: "header",
            required: true,
            description:
              "ID of the authenticated member (payer), injected by middleware.",
            schema: {
              type: "integer",
              example: 1,
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  expenseId: {
                    type: "integer",
                    description: "ID of the expense to be paid.",
                    example: 10,
                  },
                },
                required: ["expenseId"],
              },
            },
          },
        },
        responses: {
          204: {
            description: "Payment successfully completed.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Payment successfully completed",
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              "Bad Request – invalid parameters or business rule violation.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: {
                      type: "string",
                      example: "MISSING_OR_INVALID_PARAMETERS",
                    },
                    statusCode: { type: "number", example: 400 },
                    statusCodeAsString: {
                      type: "string",
                      example: "BAD_REQUEST",
                    },
                    description: {
                      type: "string",
                      example: "Missing or invalid parameters",
                    },
                  },
                },
                examples: {
                  insufficientBalance: {
                    summary: "Insufficient balance",
                    value: {
                      code: "INSUFFICIENT_BALANCE",
                      statusCode: 400,
                      statusCodeAsString: "BAD_REQUEST",
                      description: "Insufficient balance to make the transfer.",
                    },
                  },
                  missingOrInvalidParameters: {
                    summary: "Missing or invalid parameters",
                    value: {
                      code: "MISSING_OR_INVALID_PARAMETERS",
                      statusCode: 400,
                      statusCodeAsString: "BAD_REQUEST",
                      description:
                        "Group ID or Member ID is missing or invalid",
                    },
                  },
                  expenseAlreadyPaid: {
                    summary: "Expense already paid",
                    value: {
                      code: "EXPENSE_ALREADY_PAID",
                      statusCode: 400,
                      statusCodeAsString: "BAD_REQUEST",
                      description: "The expense has already been paid.",
                    },
                  },
                  expenseSplitAlreadyPaid: {
                    summary: "Expense split already paid",
                    value: {
                      code: "EXPENSE_SPLIT_ALREADY_PAID",
                      statusCode: 400,
                      statusCodeAsString: "BAD_REQUEST",
                      description: "This expense is already paid.",
                    },
                  },
                },
              },
            },
          },
          404: {
            description:
              "Not Found – expense not found or the split for the member was not found.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "string", example: "EXPENSE_NOT_FOUND" },
                    statusCode: { type: "number", example: 404 },
                    statusCodeAsString: {
                      type: "string",
                      example: "NOT_FOUND",
                    },
                    description: {
                      type: "string",
                      example:
                        "Expense not found or does not belong to the group.",
                    },
                  },
                },
                examples: {
                  expenseNotFound: {
                    summary: "Expense not found",
                    value: {
                      code: "EXPENSE_NOT_FOUND",
                      statusCode: 404,
                      statusCodeAsString: "NOT_FOUND",
                      description:
                        "Expense not found or does not belong to the group.",
                    },
                  },
                  noSplitFound: {
                    summary: "No split found for member",
                    value: {
                      code: "NO_SPLIT_FOUND",
                      statusCode: 404,
                      statusCodeAsString: "NOT_FOUND",
                      description: "No split found for this member.",
                    },
                  },
                },
              },
            },
          },
          500: {
            description:
              "Internal server error – an unexpected error occurred.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: { type: "string", example: "INTERNAL_SERVER_ERROR" },
                    statusCode: { type: "number", example: 500 },
                    statusCodeAsString: {
                      type: "string",
                      example: "INTERNAL_SERVER_ERROR",
                    },
                    description: {
                      type: "string",
                      example: "Internal server error",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
