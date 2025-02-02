export const expenseSwagger = {
  tags: [
    {
      name: "Expense",
      description:
        "Endpoints for expense operations, including creating an expense and uploading CSV files for batch expenses.",
    },
  ],
  paths: {
    "/expense": {
      post: {
        tags: ["Expense"],
        summary: "Create an expense",
        description:
          "Creates a new expense with splits among group members. The authenticated member (from header) is the creator. Optionally, you can provide an array of member IDs to split the expense with. The system will validate that the creator is not included in the split.",
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
              "ID of the authenticated member (expense creator), injected by middleware.",
            schema: {
              type: "integer",
              example: 10,
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
                  name: {
                    type: "string",
                    description: "Name of the expense.",
                    example: "Dinner",
                  },
                  amount: {
                    type: "number",
                    description: "Total amount of the expense.",
                    example: 100,
                  },
                  memberIds: {
                    type: "array",
                    items: { type: "integer" },
                    description:
                      "Optional array of member IDs to split the expense with. The creator must not be included.",
                    example: [20, 30],
                  },
                },
                required: ["name", "amount"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Expense created successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 48111 },
                    groupId: { type: "integer", example: 1 },
                    name: { type: "string", example: "Dinner" },
                    amount: { type: "number", example: 100 },
                    paid: { type: "boolean", example: false },
                    paymentDate: {
                      type: "string",
                      format: "date-time",
                      example: null,
                    },
                    createdBy: { type: "integer", example: 1 },
                    createdAt: {
                      type: "string",
                      format: "date-time",
                      example: "2025-02-02T14:33:13.235Z",
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              "Bad Request – missing or invalid parameters or business rule violation.",
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
                  includeSelf: {
                    summary: "Including self in memberIds",
                    value: {
                      code: "CANNOT_BE_YOURSELF_MEMBERID",
                      statusCode: 400,
                      statusCodeAsString: "BAD_REQUEST",
                      description:
                        "You cannot include yourself in the expense.",
                    },
                  },
                  memberNotFoundInGroup: {
                    summary: "Member not found in group",
                    value: {
                      code: "MEMBER_NOT_FOUND_IN_GROUP",
                      statusCode: 400,
                      statusCodeAsString: "BAD_REQUEST",
                      description:
                        "Member with ID {memberId} not found in group {groupId}",
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              "Unauthorized – user does not have permission to perform this action.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    code: {
                      type: "string",
                      example: "USER_NOT_IN_GROUP",
                    },
                    statusCode: { type: "number", example: 401 },
                    statusCodeAsString: {
                      type: "string",
                      example: "UNAUTHORIZED",
                    },
                    description: {
                      type: "string",
                      example: "User is not a member of the specified group",
                    },
                  },
                },
                examples: {
                  userNotInGroup: {
                    summary: "User is not a member of the specified group",
                    value: {
                      code: "USER_NOT_IN_GROUP",
                      statusCode: 401,
                      statusCodeAsString: "UNAUTHORIZED",
                      description:
                        "User is not a member of the specified group",
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
    "/expense/upload": {
      post: {
        tags: ["Expense"],
        summary: "Upload CSV for expense batch",
        description:
          "Uploads a CSV file to create expenses in batch. The endpoint accepts a CSV file and returns the URL of the uploaded file on S3.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "CSV file containing expense data.",
                  },
                },
                required: ["file"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "CSV uploaded successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    url: {
                      type: "string",
                      example:
                        "https://s3.amazonaws.com/bucket/1609459200000_file.csv",
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              "Bad Request – no file uploaded, invalid file format, or CSV errors.",
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
                      example: "No file uploaded",
                    },
                  },
                },
                examples: {
                  noFileUploaded: {
                    summary: "No file uploaded",
                    value: {
                      code: "MISSING_OR_INVALID_PARAMETERS",
                      statusCode: 400,
                      statusCodeAsString: "BAD_REQUEST",
                      description: "No file uploaded",
                    },
                  },
                  invalidFileType: {
                    summary: "Invalid file type",
                    value: {
                      code: "INVALID_FILE_TYPE",
                      statusCode: 400,
                      statusCodeAsString: "BAD_REQUEST",
                      description: "Only CSV files are allowed",
                    },
                  },
                  invalidCsvColumns: {
                    summary: "Invalid CSV columns",
                    value: {
                      code: "CSV_INVALID_COLUMNS",
                      statusCode: 400,
                      statusCodeAsString: "BAD_REQUEST",
                      description:
                        "Invalid CSV columns. Expected: groupId, memberId, memberIds, name, amount",
                    },
                  },
                  csvTooLarge: {
                    summary: "CSV file too large",
                    value: {
                      code: "CSV_TOO_LARGE",
                      statusCode: 400,
                      statusCodeAsString: "BAD_REQUEST",
                      description: "CSV file exceeds 1000 lines",
                    },
                  },
                  csvInvalidFormat: {
                    summary: "Invalid CSV format",
                    value: {
                      code: "CSV_INVALID_FORMAT",
                      statusCode: 400,
                      statusCodeAsString: "BAD_REQUEST",
                      description:
                        "CSV format error: Invalid Record Length: columns length is 5, got 7 on line 3, Please check 'memberId'; it is currently a string: '[1,2,3]'.",
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
