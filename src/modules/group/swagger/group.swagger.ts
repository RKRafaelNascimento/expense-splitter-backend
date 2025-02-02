export const groupSwagger = {
  tags: [
    {
      name: "Group",
      description:
        "Endpoints for group operations, including creating a group and adding a member to a group.",
    },
  ],
  paths: {
    "/group": {
      post: {
        tags: ["Group"],
        summary: "Create a new group",
        description:
          "Creates a new group with the provided name. If a group with the same name already exists, an error is thrown.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Name of the group",
                    example: "My Group",
                  },
                },
                required: ["name"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Group created successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 1 },
                    name: { type: "string", example: "My Group" },
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
              "Bad Request – missing or invalid parameters or group already exists.",
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
                  missingOrInvalidParameters: {
                    summary: "Missing or invalid parameters",
                    value: {
                      code: "MISSING_OR_INVALID_PARAMETERS",
                      statusCode: 400,
                      statusCodeAsString: "BAD_REQUEST",
                      description: "Missing or invalid parameters",
                    },
                  },
                  groupAlreadyExists: {
                    summary: "Group already exists",
                    value: {
                      code: "GROUP_ALREADY_EXISTS",
                      statusCode: 400,
                      statusCodeAsString: "BAD_REQUEST",
                      description:
                        "A group with the name My Group already exists",
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
    "/group/add-member": {
      post: {
        tags: ["Group"],
        summary: "Add a member to a group",
        description:
          "Adds a member to an existing group. Throws errors if the member does not exist, the group does not exist, or the member is already in the group.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  groupId: {
                    type: "integer",
                    description: "ID of the group",
                    example: 1,
                  },
                  memberId: {
                    type: "integer",
                    description: "ID of the member to add",
                    example: 5,
                  },
                },
                required: ["groupId", "memberId"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Member added successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Member added successfully",
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              "Bad Request – missing or invalid parameters or member already in the group.",
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
                  missingOrInvalidParameters: {
                    summary: "Missing or invalid parameters",
                    value: {
                      code: "MISSING_OR_INVALID_PARAMETERS",
                      statusCode: 400,
                      statusCodeAsString: "BAD_REQUEST",
                      description: "Missing or invalid parameters",
                    },
                  },
                  memberAlreadyInGroup: {
                    summary: "Member already in group",
                    value: {
                      code: "MEMBER_IS_ALREADY_GROUP",
                      statusCode: 400,
                      statusCodeAsString: "BAD_REQUEST",
                      description: "Member is already in the group",
                    },
                  },
                },
              },
            },
          },
          404: {
            description:
              "Not Found – either the member or the group does not exist.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: {
                      type: "string",
                      example: "MEMBER_DOES_NOT_EXIST",
                    },
                    statusCode: { type: "number", example: 404 },
                    statusCodeAsString: {
                      type: "string",
                      example: "NOT_FOUND",
                    },
                    description: {
                      type: "string",
                      example: "Member does not exist",
                    },
                  },
                },
                examples: {
                  memberDoesNotExist: {
                    summary: "Member does not exist",
                    value: {
                      code: "MEMBER_DOES_NOT_EXIST",
                      statusCode: 404,
                      statusCodeAsString: "NOT_FOUND",
                      description: "Member does not exist",
                    },
                  },
                  groupDoesNotExist: {
                    summary: "Group does not exist",
                    value: {
                      code: "GROUP_DOES_NOT_EXIST",
                      statusCode: 404,
                      statusCodeAsString: "NOT_FOUND",
                      description: "Group does not exist",
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
