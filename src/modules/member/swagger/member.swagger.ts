export const memberSwagger = {
  tags: [
    {
      name: "Member",
      description:
        "Endpoints for member operations, such as creating a member.",
    },
  ],
  paths: {
    "/member": {
      post: {
        tags: ["Member"],
        summary: "Create a new member",
        description:
          "Creates a new member using the provided name and email. If a member with the given email already exists, an error is thrown.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Name of the member",
                    example: "Test",
                  },
                  email: {
                    type: "string",
                    description: "Email of the member",
                    example: "test@example.com",
                  },
                },
                required: ["name", "email"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Member created successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "integer",
                      example: 1,
                    },
                    name: {
                      type: "string",
                      example: "Test",
                    },
                    email: {
                      type: "string",
                      example: "test@example.com",
                    },
                    createdAt: {
                      type: "string",
                      format: "date-time",
                      example: "2023-05-12T12:00:00Z",
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              "Bad Request – missing or invalid parameters or email already exists.",
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
                      example: "Missing Params or Invalid",
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
                      description: "Missing Params or Invalid",
                    },
                  },
                  emailAlreadyExists: {
                    summary: "Email already exists",
                    value: {
                      code: "EMAIL_ALREADY_EXISTS",
                      statusCode: 400,
                      statusCodeAsString: "BAD_REQUEST",
                      description:
                        "A member with the email test@example.com already exists",
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
