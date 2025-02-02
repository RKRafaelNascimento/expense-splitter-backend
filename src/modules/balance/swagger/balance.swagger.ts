export const balanceSwagger = {
  tags: [
    {
      name: "Balance",
      description:
        "Endpoints for retrieving balances for a group, including current balance, total amounts owed, and net balance.",
    },
  ],
  paths: {
    "/balance/{groupId}": {
      get: {
        tags: ["Balance"],
        summary: "Retrieve all balances for a given group",
        description:
          "Returns the balances for all members in a group. For each member, it provides the current balance, the total amount the member owes, the total amount owed to the member, and the net balance.",
        parameters: [
          {
            name: "groupId",
            in: "path",
            required: true,
            description: "ID of the group to retrieve balances for.",
            schema: {
              type: "integer",
              example: 1,
            },
          },
        ],
        responses: {
          200: {
            description: "Balances retrieved successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        example: "Test",
                      },
                      email: {
                        type: "string",
                        example: "test@example.com",
                      },
                      currentBalance: {
                        type: "number",
                        example: 100,
                      },
                      totalYouOweAmount: {
                        type: "number",
                        example: 10,
                      },
                      totalOwedAmount: {
                        type: "number",
                        example: 20,
                      },
                      netBalance: {
                        type: "number",
                        example: 90,
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              "Bad Request - invalid parameters. For example, if the groupId is missing or invalid.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: {
                      type: "string",
                      example: "MISSING_OR_INVALID_PARAMETERS",
                    },
                    statusCode: {
                      type: "number",
                      example: 400,
                    },
                    statusCodeAsString: {
                      type: "string",
                      example: "BAD_REQUEST",
                    },
                    description: {
                      type: "string",
                      example: "Group ID is missing or invalid",
                    },
                  },
                },
                examples: {
                  missingOrInvalidParameters: {
                    summary: "Missing or invalid parameters",
                    value: {
                      code: "MISSING_OR_INVALID_PARAMETERS",
                      statusCode: 400,
                      statusCodeAsString: "BAD_REQUEST",
                      description: "Group ID is missing or invalid",
                    },
                  },
                },
              },
            },
          },
          500: {
            description:
              "Internal server error – an unexpected error occurred while retrieving balances.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: {
                      type: "string",
                      example: "INTERNAL_SERVER_ERROR",
                    },
                    statusCode: {
                      type: "number",
                      example: 500,
                    },
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
