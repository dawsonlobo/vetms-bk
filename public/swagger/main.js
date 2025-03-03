(async () => {
  const docs = document.getElementById("docs");
  const apiDescriptionDocument = {
    openapi: "3.0.0",
    info: {
      title: "VETMS",
      version: "1.0.1",
      description: "A simple API application with Swagger documentation",
    },
    servers: [{ url: "http://localhost:3000/" }],
    components: {
      securitySchemes: {
        adminBearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Specify the admin token",
        },
        userBearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Specify the user token",
        },
        nurseBearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Specify the nurse token",
        },
        doctorBearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Specify the nurse token",
        },
        genericBearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter any role's token",
        },
      },
      schemas: {
        AccessToken: {
          type: "object",
          required: ["userId", "token", "createdAt"],
          properties: {
            _id: {
              type: "string",
              format: "ObjectId",
              description: "Unique ID of the access token",
              example: "6512c5f3e4b09a12d8f42b68",
            },
            userId: {
              type: "string",
              format: "ObjectId",
              description: "Unique ID of the user associated with the token",
              example: "6512c5f3e4b09a12d8f42b69",
            },
            token: {
              type: "string",
              description: "JWT or session token for authentication",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9...",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the token was created",
              example: "2024-02-10T12:00:00Z",
            },
          },
        },
        appointments: {
          type: "object",
          required: ["patientId", "doctorId", "nurseId", "date", "status"],
          properties: {
            _id: {
              type: "string",
              format: "objectId",
              description: "Unique identifier for the appointment",
              example: "507f1f77bcf86cd799439011",
            },
            patientId: {
              type: "string",
              format: "objectId",
              description:
                "Unique identifier of the patient for the appointment",
              example: "60d5ec49f72b4c0015d3b456",
            },
            doctorId: {
              type: "string",
              format: "objectId",
              description:
                "Unique identifier of the doctor for the appointment",
              example: "60d5ec49f72b4c0015d3b123",
            },
            nurseId: {
              type: "string",
              format: "objectId",
              nullable: true,
              description:
                "Unique identifier of the assigned nurse (if applicable)",
              example: "60d5ec49f72b4c0015d3b789",
            },
            receptionistId: {
              type: "string",
              format: "objectId",
              nullable: true,
              description:
                "Unique identifier of the receptionist who scheduled the appointment",
              example: "60d5ec49f72b4c0015d3b999",
            },
            date: {
              type: "string",
              format: "date",
              description: "Date of the appointment",
              example: "2025-03-10",
            },
            status: {
              type: "string",
              enum: ["PENDING", "CANCELLED", "COMPLETED", "NOT_ATTENDED"],
              description: "Status of the appointment",
              example: "PENDING",
            },
            remarks: {
              type: "string",
              description: "Additional comments or notes about the appointment",
              example: "Patient requested a follow-up next week.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the appointment was created",
              example: "2024-02-19T12:34:56Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the appointment was last updated",
              example: "2024-02-20T15:45:30Z",
            },
          },
        },
        billings: {
          type: "object",
          required: [
            "patientId",
            "receptionistId",
            "doctorId",
            "totalAmount",
            "billItems",
          ],
          properties: {
            _id: {
              type: "string",
              format: "objectId",
              description: "Unique identifier for the bill",
              example: "507f1f77bcf86cd799439011",
            },
            patientId: {
              type: "string",
              format: "objectId",
              description: "Unique identifier of the pet",
              example: "60d5ec49f72b4c0015d3b456",
            },
            receptionistId: {
              type: "string",
              format: "objectId",
              description:
                "Unique identifier of the receptionist who processed the bill",
              example: "60d5ec49f72b4c0015d3b789",
            },
            doctorId: {
              type: "string",
              format: "objectId",
              description:
                "Unique identifier of the doctor who provided treatment",
              example: "60d5ec49f72b4c0015d3b123",
            },
            totalAmount: {
              type: "number",
              description: "Total amount for the bill",
              example: 1500.75,
            },
            billItems: {
              type: "array",
              description: "List of items included in the bill",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Name of the billed item",
                    example: "X-Ray",
                  },
                  description: {
                    type: "string",
                    description: "Description of the billed item",
                    example: "X-Ray scan for leg injury",
                  },
                  quantity: {
                    type: "number",
                    description: "Quantity of the billed item",
                    example: 1,
                  },
                  price: {
                    type: "number",
                    description: "Price per unit of the billed item",
                    example: 500,
                  },
                  amount: {
                    type: "number",
                    description:
                      "Total amount for this item (Quantity * Price)",
                    example: 500,
                  },
                },
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the bill was created",
              example: "2024-02-19T12:34:56Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the bill was last updated",
              example: "2024-02-20T15:45:30Z",
            },
          },
        },
        followUp: {
          type: "object",
          required: [
            "patientId",
            "doctorId",
            "diagnosis",
            "treatment",
            "prescription",
            "visitDate",
          ],
          properties: {
            _id: {
              type: "string",
              format: "ObjectId",
              description: "Unique ID of the follow-up record",
              example: "6512c5f3e4b09a12d8f42b68",
            },
            patientId: {
              type: "string",
              format: "ObjectId",
              description: "Unique ID of the pet associated with the follow-up",
              example: "6512c5f3e4b09a12d8f42b69",
            },
            doctorId: {
              type: "string",
              format: "ObjectId",
              description:
                "Unique ID of the doctor responsible for the follow-up",
              example: "6512c5f3e4b09a12d8f42b70",
            },
            diagnosis: {
              type: "string",
              description: "Diagnosis of the pet's condition",
              example: "Skin infection due to allergy",
            },
            treatment: {
              type: "string",
              description: "Treatment provided to the pet",
              example: "Antibiotic injection and medicated shampoo",
            },
            prescription: {
              type: "string",
              description: "Prescribed medications for the pet",
              example: "Amoxicillin 250mg, Antihistamines",
            },
            visitDate: {
              type: "string",
              format: "date",
              description: "Date of the follow-up visit",
              example: "2024-02-10",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the follow-up record was created",
              example: "2024-02-10T12:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description:
                "Timestamp when the follow-up record was last updated",
              example: "2024-02-11T15:30:00Z",
            },
          },
        },
        inventories: {
          type: "object",
          required: ["name", "price", "quantity"],
          properties: {
            _id: {
              type: "string",
              format: "objectId",
              description: "Unique identifier for the inventory item",
              example: "507f1f77bcf86cd799439011",
            },
            name: {
              type: "string",
              description: "Name of the inventory item",
              example: "Dog Food",
            },
            price: {
              type: "number",
              description: "Price of the inventory item",
              example: 500.75,
            },
            quantity: {
              type: "number",
              description: "Available quantity of the inventory item",
              example: 20,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the inventory item was created",
              example: "2024-02-19T12:34:56Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the inventory item was last updated",
              example: "2024-02-20T15:45:30Z",
            },
          },
        },
        OTP: {
          type: "object",
          required: ["userId", "email", "phone", "createdAt", "expiresAt"],
          properties: {
            _id: {
              type: "string",
              format: "ObjectId",
              description: "Unique ID of the OTP record",
              example: "6512c5f3e4b09a12d8f42b68",
            },
            userId: {
              type: "string",
              format: "ObjectId",
              description: "Unique ID of the user associated with the OTP",
              example: "6512c5f3e4b09a12d8f42b69",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email address associated with the OTP",
              example: "user@example.com",
            },
            phone: {
              type: "string",
              description: "Phone number associated with the OTP",
              example: "+1234567890",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the OTP was generated",
              example: "2024-02-10T12:00:00Z",
            },
            expiresAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the OTP expires",
              example: "2024-02-10T12:05:00Z",
            },
          },
        },
        patients: {
          type: "object",
          required: [
            "name",
            "species",
            "breed",
            "age",
            "weight",
            "gender",
            "medicalHistory",
            "BMI",
            "bloodGroup",
          ],
          properties: {
            _id: {
              type: "string",
              format: "objectId",
              description: "Unique identifier for the pet",
              example: "507f1f77bcf86cd799439011",
            },
            name: {
              type: "string",
              description: "Name of the pet",
              example: "Buddy",
            },
            species: {
              type: "string",
              description: "Species of the pet",
              example: "Dog",
            },
            breed: {
              type: "string",
              description: "Breed of the pet",
              example: "Golden Retriever",
            },
            DOB: {
              type: "string",
              format: "date",
              description: "Date of birth of the patient",
              example: "1990-05-15",
            },
            weight: {
              type: "number",
              description: "Weight of the pet in kilograms",
              example: 25.5,
            },
            gender: {
              type: "string",
              enum: ["MALE", "FEMALE"],
              description: "Gender of the pet",
              example: "MALE",
            },
            medicalHistory: {
              type: "string",
              description: "Medical history of the pet",
              example: "Vaccinated, No major illnesses",
            },
            BMI: {
              type: "number",
              description: "Body Mass Index of the pet",
              example: 18.2,
            },
            bloodGroup: {
              type: "string",
              enum: [
                "DEA 1.1+",
                "DEA 1.1-",
                "DEA 1.2+",
                "DEA 1.2-",
                "DEA 3",
                "DEA 4",
                "DEA 5",
                "DEA 7",
                "A",
                "B",
                "AB",
              ],
              description: "Blood group of the pet",
              example: "DEA 1.1+",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the pet record was created",
              example: "2024-02-19T12:34:56Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the pet record was last updated",
              example: "2024-02-20T15:45:30Z",
            },
          },
        },
        payments: {
          type: "object",
          required: [
            "appointmentId",
            "amount",
            "paymentStatus",
            "reference_no",
          ],
          properties: {
            _id: {
              type: "string",
              format: "objectId",
              description: "Unique identifier for the payment",
              example: "507f1f77bcf86cd799439011",
            },
            appointmentId: {
              type: "string",
              format: "objectId",
              description:
                "Unique identifier of the appointment related to the payment",
              example: "60d5ec49f72b4c0015d3b789",
            },
            amount: {
              type: "number",
              description: "Payment amount",
              example: 1200.5,
            },
            paymentStatus: {
              type: "string",
              enum: ["PENDING", "PAID", "CANCELLED"],
              description: "Status of the payment",
              example: "PAID",
            },
            reference_no: {
              type: "string",
              description: "Unique reference number for the payment",
              example: "TXN123456789",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the payment was created",
              example: "2024-02-19T12:34:56Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the payment was last updated",
              example: "2024-02-20T15:45:30Z",
            },
          },
        },
        refreshToken: {
          type: "object",
          required: ["userId", "token", "createdAt"],
          properties: {
            _id: {
              type: "string",
              format: "ObjectId",
              description: "Unique ID of the access token",
              example: "6512c5f3e4b09a12d8f42b68",
            },
            userId: {
              type: "string",
              format: "ObjectId",
              description: "Unique ID of the user associated with the token",
              example: "6512c5f3e4b09a12d8f42b69",
            },
            token: {
              type: "string",
              description: "JWT or session token for authentication",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9...",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the token was created",
              example: "2024-02-10T12:00:00Z",
            },
          },
        },
        User: {
          type: "object",
          required: ["name", "email", "password", "role"],
          properties: {
            _id: {
              type: "string",
              format: "ObjectId",
              description: "The unique ID of the user",
              example: "6512c5f3e4b09a12d8f42b68",
            },
            name: {
              type: "string",
              description: "Full name of the user",
              example: "Dr. John Smith",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email address of the user",
              example: "john.smith@example.com",
            },
            password: {
              type: "string",
              description: "Encrypted password of the user",
              example:
                "$2b$10$7sPbQKq5b6pP0v9hB1X1euLXjzXq99yI8kTvqzQyQxUIUOJDgN/Nm",
            },
            role: {
              type: "string",
              enum: ["ADMIN", "DOCTOR", "RECEPTIONIST", "NURSE"],
              description: "Role of the user in the system",
              example: "DOCTOR",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the user was created",
              example: "2024-02-05T12:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the user was last updated",
              example: "2024-02-06T15:30:00Z",
            },
          },
        },
      },
    },
    paths: {
      "/v1/admin/appointments/getAll": {
        post: {
          tags: ["admin/appointments"],
          security: [{ adminBearerAuth: [] }],
          summary: "Get all",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    projection: {
                      type: "object",
                      description:
                        "Fields to include in the response (projection)",
                    },
                    filter: {
                      type: "object",
                      description:
                        "Filters to apply when retrieving appointments",
                    },
                    options: {
                      type: "object",
                      description: "Options for pagination and sorting",
                    },
                    pagination: {
                      type: "object",
                      description: "Pagination settings for the response",
                    },
                    search: {
                      type: "array",
                      description: "Search settings for the request",
                      items: { type: "object" },
                    },
                    date: {
                      type: "integer",
                      description: "The specific date in Unix timestamp format",
                    },
                    fromDate: {
                      type: "integer",
                      description: "The starting date in Unix timestamp format",
                    },
                    toDate: {
                      type: "integer",
                      description: "The ending date in Unix timestamp format",
                    },
                  },
                },
                examples: {
                  projectionExample: {
                    summary: "Projection Example",
                    value: {
                      projection: {
                        _id: 1,
                        patientId: 1,
                        doctorId: 1,
                        date: 1,
                        schedule: 1,
                        createdAt: 1,
                        updatedAt: 1,
                      },
                    },
                  },
                  filterExample: {
                    summary: "Filter Example",
                    value: {
                      filter: {
                        doctorId: "66b3279c39c21f7342c13333",
                        schedule: "SCHEDULED",
                        petId: {
                          $in: [
                            "66b3279c39c21f7342c12222",
                            "66b3279c39c21f7342c14444",
                          ],
                        },
                      },
                    },
                  },
                  singleDateExample: {
                    summary: "Multi-date Example",
                    value: { date: 1738658701 },
                  },
                  multiDateExample: {
                    summary: "Single-date Example",
                    value: { fromDate: 1707036301, toDate: 1738658701 },
                  },
                  pagination: {
                    summary: "Pagination Example",
                    value: { options: { page: 1, itemsPerPage: 10 } },
                  },
                  sortExample: {
                    summary: "Sort Example",
                    value: {
                      options: { sortBy: ["createdAt"], sortDesc: [true] },
                    },
                  },
                  searchExample: {
                    summary: "Search Example",
                    value: {
                      search: [
                        {
                          term: "SCHEDULED",
                          fields: ["schedule"],
                          startsWith: true,
                          endsWith: false,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get all appointments.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          totalCount: {
                            type: "integer",
                            description: "Total number of appointments",
                          },
                          tableData: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                _id: {
                                  type: "string",
                                  description:
                                    "The unique ID of the appointment",
                                },
                                patientId: {
                                  type: "string",
                                  description: "The ID of the pet",
                                },
                                doctorId: {
                                  type: "string",
                                  description: "The ID of the doctor",
                                },
                                date: {
                                  type: "string",
                                  format: "date-time",
                                  description:
                                    "The date and time of the appointment",
                                },
                                schedule: {
                                  type: "string",
                                  enum: ["SCHEDULED", "COMPLETED", "CANCELLED"],
                                  description:
                                    "The current status of the appointment",
                                },
                                createdAt: {
                                  type: "string",
                                  format: "date-time",
                                  description:
                                    "Timestamp when the appointment was created",
                                },
                                updatedAt: {
                                  type: "string",
                                  format: "date-time",
                                  description:
                                    "Timestamp when the appointment was last updated",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    example1: {
                      summary: "Successful response with data",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          totalCount: 2,
                          tableData: [
                            {
                              _id: "66b3279c39c21f7342c125b4",
                              patientId: "66b3279c39c21f7342c12222",
                              doctorId: "66b3279c39c21f7342c13333",
                              date: "2025-02-01T08:00:00Z",
                              schedule: "SCHEDULED",
                              createdAt: "2025-02-01T08:00:00Z",
                              updatedAt: "2025-02-01T08:00:00Z",
                            },
                            {
                              _id: "66b3279c39c21f7342c1520n",
                              patientId: "66b3279c39c21f7342c14444",
                              doctorId: "66b3279c39c21f7342c15555",
                              date: "2025-02-02T10:30:00Z",
                              schedule: "COMPLETED",
                              createdAt: "2025-02-02T08:00:00Z",
                              updatedAt: "2025-02-02T08:00:00Z",
                            },
                          ],
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
      "/v1/admin/appointments/getOne/{id}": {
        post: {
          tags: ["admin/appointments"],
          security: [{ adminBearerAuth: [] }],
          summary: "Get one",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description:
                "The unique identifier of the appointment to retrieve",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    project: {
                      type: "object",
                      description:
                        "Fields to include or exclude in the response",
                    },
                  },
                },
                examples: {
                  projectionExample: {
                    summary: "Example with projection",
                    value: {
                      project: {
                        _id: 1,
                        patientId: 1,
                        doctorId: 1,
                        date: 1,
                        schedule: 1,
                        createdAt: 1,
                        updatedAt: 1,
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get one appointment.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            description: "The unique ID of the appointment",
                          },
                          patientId: {
                            type: "string",
                            description:
                              "The ID of the pet associated with the appointment",
                          },
                          doctorId: {
                            type: "string",
                            description:
                              "The ID of the doctor assigned to the appointment",
                          },
                          date: {
                            type: "string",
                            format: "date-time",
                            description: "The date and time of the appointment",
                          },
                          schedule: {
                            type: "string",
                            enum: ["SCHEDULED", "COMPLETED", "CANCELLED"],
                            description: "The status of the appointment",
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the appointment was created",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the appointment was last updated",
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    "get-one-appointment": {
                      summary: "Successful response",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          _id: "66b3279c39c21f7342c1520a",
                          patientId: "66b3279c39c21f7342c1520p",
                          doctorId: "66b3279c39c21f7342c1520d",
                          date: "2025-02-19T10:00:00Z",
                          schedule: "SCHEDULED",
                          createdAt: "2025-02-01T08:00:00Z",
                          updatedAt: "2025-02-01T08:00:00Z",
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
      "/v1/admin/auth/login": {
        post: {
          summary: "login",
          tags: ["admin/auth"],
          security: [{ adminBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", example: "alex@example.com" },
                    password: { type: "string", example: "admin123" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: { type: "string", example: "Success" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            example: "6512c5f3e4b09a12d8f42b68",
                          },
                          name: { type: "string", example: "Alex" },
                          email: {
                            type: "string",
                            example: "alex@example.com",
                          },
                          role: { type: "string", example: "ADMIN" },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-02-06T15:30:00Z",
                          },
                          access_token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9...",
                          },
                          refresh_token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9...",
                          },
                          tokenExpiresAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-07-15T12:57:10.956Z",
                          },
                        },
                      },
                      toastMessage: {
                        type: "string",
                        example: "Login successful",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/admin/auth/logout": {
        post: {
          summary: "logout",
          tags: ["admin/auth"],
          security: [{ adminBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    refresh_token: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9...",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Logout successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: { type: "string", example: "Success" },
                      data: {
                        type: "string",
                        example: "Admin logged out successfully",
                      },
                      toastMessage: {
                        type: "string",
                        example: "Admin logged out successfully",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/admin/auth/profile": {
        post: {
          summary: "Get user profile",
          tags: ["admin/auth"],
          security: [{ adminBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    project: {
                      type: "object",
                      description: "Projection fields (optional)",
                      properties: {
                        _id: { type: "integer", example: 1 },
                        name: { type: "integer", example: 1 },
                        email: { type: "integer", example: 1 },
                        role: { type: "integer", example: 1 },
                        isVerified: { type: "integer", example: 1 },
                        createdAt: { type: "integer", example: 1 },
                        updatedAt: { type: "integer", example: 1 },
                        access_token: { type: "integer", example: 1 },
                        refresh_token: { type: "integer", example: 1 },
                        tokenExpiresAt: { type: "integer", example: 1 },
                      },
                    },
                  },
                },
                examples: {
                  fullProjection: {
                    summary: "Full data projection (Retrieve all fields)",
                    value: {
                      project: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        role: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        access_token: 1,
                        refresh_token: 1,
                        tokenExpiresAt: 1,
                      },
                    },
                  },
                  limitedProjection: {
                    summary:
                      "Limited data projection (Retrieve only _id and createdAt)",
                    value: { project: { _id: 1, createdAt: 1 } },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "User profile retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: { type: "string", example: "Success" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            example: "6512c5f3e4b09a12d8f42b68",
                          },
                          name: { type: "string", example: "Admin User" },
                          email: {
                            type: "string",
                            example: "admin@example.com",
                          },
                          role: { type: "string", example: "ADMIN" },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-02-05T12:00:00Z",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-02-06T15:30:00Z",
                          },
                          access_token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9...",
                          },
                          refresh_token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9...",
                          },
                          tokenExpiresAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-02-07T18:00:00Z",
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    fullResponse: {
                      summary: "Full response (all fields)",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          _id: "6512c5f3e4b09a12d8f42b68",
                          name: "Admin User",
                          email: "admin@example.com",
                          role: "ADMIN",
                          createdAt: "2024-02-05T12:00:00Z",
                          updatedAt: "2024-02-06T15:30:00Z",
                          access_token:
                            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9...",
                          refresh_token:
                            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9...",
                          tokenExpiresAt: "2024-02-07T18:00:00Z",
                        },
                      },
                    },
                    limitedResponse: {
                      summary: "Limited response (only _id and createdAt)",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          _id: "6512c5f3e4b09a12d8f42b68",
                          createdAt: "2024-02-05T12:00:00Z",
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
      "/v1/admin/auth/update": {
        put: {
          summary: "Update user profile",
          tags: ["admin/auth"],
          security: [{ adminBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "Alex" },
                    email: { type: "string", example: "alex@example.com" },
                    role: {
                      type: "string",
                      enum: ["ADMIN", "DOCTOR", "RECEPTIONIST", "NURSE"],
                      example: "ADMIN",
                    },
                    isDeleted: { type: "boolean", example: false },
                  },
                  required: ["name", "email", "role"],
                },
                examples: {
                  fullUpdate: {
                    summary: "Full profile update",
                    value: {
                      name: "Alex",
                      email: "alex@example.com",
                      role: "DOCTOR",
                      isDeleted: false,
                    },
                  },
                  partialUpdate: {
                    summary: "Update only isDeleted status",
                    value: { isDeleted: true },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "User profile updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: { type: "string", example: "Success" },
                      data: { type: "string", example: "Updated successfully" },
                      toastMessage: {
                        type: "string",
                        example: "Updated successfully",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/admin/auth/refresh": {
        post: {
          summary: "Refresh user token",
          tags: ["admin/auth"],
          security: [{ adminBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    refresh_token: {
                      type: "string",
                      example:
                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV2CJ9.eyJpYXQiOjE3MTg0NTYyMzEsImV4cCI6MjAzMzgxNjIzMX0.Po_Xc3McuJt4GhKWpd1B5cUcHsdZWq_4ElO138VmsU",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Token refreshed successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: { type: "string", example: "Success" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            example: "6512c5f3e4b09a12d8f42b68",
                          },
                          name: { type: "string", example: "Admin User" },
                          email: {
                            type: "string",
                            example: "admin@example.com",
                          },
                          role: { type: "string", example: "ADMIN" },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-02-05T12:00:00Z",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-02-06T15:30:00Z",
                          },
                          access_token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV2CJ9...",
                          },
                          refresh_token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV2CJ9...",
                          },
                          tokenExpiresAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-07-15T12:57:10.956Z",
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
      },
      "/v1/admin/billings/upsert": {
        post: {
          tags: ["admin/billings"],
          security: [{ adminBearerAuth: [] }],
          summary: "Upsert a billing record",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    _id: {
                      type: "string",
                      description:
                        "The unique ID of the billing record (if updating)",
                      example: "65d1234567abcdef12345678",
                    },
                    patientId: {
                      type: "string",
                      description:
                        "The ID of the patient associated with the billing",
                      example: "65d9ab12cd34ef56789abcd1",
                    },
                    receptionistId: {
                      type: "string",
                      description:
                        "The ID of the receptionist handling the billing",
                      example: "65d9abcd1234ef56789abcdef",
                    },
                    doctorId: {
                      type: "string",
                      description:
                        "The ID of the doctor associated with the billing",
                      example: "65d9abcdef123456789abcde",
                    },
                    totalAmount: {
                      type: "number",
                      format: "float",
                      description: "The total amount billed",
                      example: 1500.75,
                    },
                    billItems: {
                      type: "array",
                      description: "List of items in the bill",
                      items: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                            description: "Name of the billed item",
                            example: "general checkup",
                          },
                          description: {
                            type: "string",
                            description: "Description of the billed item",
                            example: "normal checkup of pet",
                          },
                          price: {
                            type: "number",
                            format: "float",
                            description: "Price of the billed item",
                            example: 500.25,
                          },
                          quantity: {
                            type: "integer",
                            description: "Quantity of the billed item",
                            example: 1,
                          },
                          amount: {
                            type: "number",
                            format: "float",
                            description: "Amount for the billed item",
                            example: 500.25,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Billing record updated successfully.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: { type: "string", example: "Success" },
                      data: {
                        type: "string",
                        example: "Billing record updated successfully",
                      },
                      toastMessage: {
                        type: "string",
                        example: "Billing updated successfully",
                      },
                    },
                  },
                },
              },
            },
            201: {
              description: "Billing record created successfully.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 201 },
                      message: { type: "string", example: "Success" },
                      data: {
                        type: "string",
                        example: "Billing record created successfully",
                      },
                      toastMessage: {
                        type: "string",
                        example: "Billing successfully added",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/admin/billings/getAll": {
        post: {
          tags: ["admin/billings"],
          security: [{ adminBearerAuth: [] }],
          summary: "Get all",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    projection: {
                      type: "object",
                      description:
                        "Fields to include in the response (projection)",
                    },
                    filter: {
                      type: "object",
                      description: "Filters to apply when retrieving billings",
                    },
                    options: {
                      type: "object",
                      description: "Options for pagination and sorting",
                    },
                    pagination: {
                      type: "object",
                      description: "Pagination settings for the response",
                    },
                    search: {
                      type: "array",
                      description: "Search settings for the request",
                      items: { type: "object" },
                    },
                    date: {
                      type: "integer",
                      description: "The specific date in Unix timestamp format",
                    },
                    fromDate: {
                      type: "integer",
                      description: "The starting date in Unix timestamp format",
                    },
                    toDate: {
                      type: "integer",
                      description: "The ending date in Unix timestamp format",
                    },
                  },
                },
                examples: {
                  projectionExample: {
                    summary: "Projection Example",
                    value: {
                      projection: {
                        _id: 1,
                        patientId: 1,
                        receptionistId: 1,
                        doctorId: 1,
                        totalAmount: 1,
                        billItems: 1,
                        createdAt: 1,
                        updatedAt: 1,
                      },
                    },
                  },
                  singleDateExample: {
                    summary: "Single Date Example",
                    value: { date: 1738658701 },
                  },
                  multiDateExample: {
                    summary: "Multi-Date Example",
                    value: { fromDate: 1707036301, toDate: 1738658701 },
                  },
                  pagination: {
                    summary: "Pagination Example",
                    value: { options: { page: 1, itemsPerPage: 10 } },
                  },
                  sortExample: {
                    summary: "Sort Example",
                    value: {
                      options: { sortBy: ["createdAt"], sortDesc: [true] },
                    },
                  },
                  searchExample: {
                    summary: "Search Example",
                    value: {
                      search: [
                        {
                          term: 500,
                          fields: ["totalAmount"],
                          startsWith: false,
                          endsWith: false,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get all billings.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          totalCount: {
                            type: "integer",
                            description: "Total number of billings",
                          },
                          tableData: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                _id: {
                                  type: "string",
                                  description:
                                    "The unique ID of the billing record",
                                },
                                patientId: {
                                  type: "string",
                                  description:
                                    "The ID of the pet associated with the billing",
                                },
                                receptionistId: {
                                  type: "string",
                                  description:
                                    "The ID of the receptionist who processed the billing",
                                },
                                doctorId: {
                                  type: "string",
                                  description:
                                    "The ID of the doctor who attended to the pet",
                                },
                                totalAmount: {
                                  type: "number",
                                  format: "float",
                                  description: "The total amount billed",
                                },
                                billItems: {
                                  type: "array",
                                  description: "List of items in the bill",
                                  items: {
                                    type: "object",
                                    properties: {
                                      itemName: {
                                        type: "string",
                                        description: "Name of the billed item",
                                      },
                                      price: {
                                        type: "number",
                                        format: "float",
                                        description: "Price of the billed item",
                                      },
                                      quantity: {
                                        type: "integer",
                                        description:
                                          "Quantity of the billed item",
                                      },
                                    },
                                  },
                                },
                                createdAt: {
                                  type: "string",
                                  format: "date-time",
                                  description:
                                    "Timestamp when the billing record was created",
                                },
                                updatedAt: {
                                  type: "string",
                                  format: "date-time",
                                  description:
                                    "Timestamp when the billing record was last updated",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    example1: {
                      summary: "Successful response with data",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          totalCount: 2,
                          tableData: [
                            {
                              _id: "66b3279c39c21f7342c125b4",
                              patientId: "66b3279c39c21f7342c1520p",
                              receptionistId: "66b3279c39c21f7342c178d",
                              doctorId: "66b3279c39c21f7342c19ab",
                              totalAmount: 5000.75,
                              billItems: [
                                {
                                  _id: "67b9605f11e553a30ad69f86",
                                  name: "Vaccination",
                                  discrption: "Rabies vaccination",
                                  quantity: 1,
                                  price: 2000,
                                  amount: 2000,
                                },
                                {
                                  _id: "67b9605f11e553a30ad69f87",
                                  name: "Deworming",
                                  discrption: "Deworming for puppies",
                                  quantity: 2,
                                  price: 1500,
                                  amount: 3000,
                                },
                              ],
                              createdAt: "2025-02-01T08:00:00Z",
                              updatedAt: "2025-02-01T08:00:00Z",
                            },
                            {
                              _id: "66b3279c39c21f7342c1520n",
                              patientId: "66b3279c39c21f7342c1520q",
                              receptionistId: "66b3279c39c21f7342c178e",
                              doctorId: "66b3279c39c21f7342c19ac",
                              totalAmount: 3000.5,
                              billItems: [
                                {
                                  _id: "67b9605f11e553a30ad69f88",
                                  name: "General Checkup",
                                  description: "General checkup for pets",
                                  quantity: 1,
                                  price: 1500,
                                  amount: 1500,
                                },
                                {
                                  _id: "67b9605f11e553a30ad69f89",
                                  name: "Grooming",
                                  description: "Grooming for pets",
                                  quantity: 1,
                                  price: 1500.5,
                                  amount: 1500.5,
                                },
                              ],
                              createdAt: "2025-02-02T08:30:00Z",
                              updatedAt: "2025-02-02T08:30:00Z",
                            },
                          ],
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
      "/v1/admin/billings/getOne/{id}": {
        post: {
          tags: ["admin/billings"],
          security: [{ adminBearerAuth: [] }],
          summary: "Get one",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description:
                "The unique identifier of the billing record to retrieve",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    project: {
                      type: "object",
                      description:
                        "Fields to include or exclude in the response",
                    },
                  },
                },
                examples: {
                  projectionExample: {
                    summary: "Example with projection",
                    value: {
                      projection: {
                        _id: 1,
                        patientId: 1,
                        receptionistId: 1,
                        doctorId: 1,
                        totalAmount: 1,
                        billItems: 1,
                        createdAt: 1,
                        updatedAt: 1,
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get one billing record.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            description: "The unique ID of the billing record",
                          },
                          patientId: {
                            type: "string",
                            description:
                              "The ID of the pet associated with the billing",
                          },
                          receptionistId: {
                            type: "string",
                            description:
                              "The ID of the receptionist who processed the billing",
                          },
                          doctorId: {
                            type: "string",
                            description:
                              "The ID of the doctor associated with the billing",
                          },
                          totalAmount: {
                            type: "number",
                            format: "float",
                            description: "The total amount of the billing",
                          },
                          billItems: {
                            type: "array",
                            description: "List of items in the bill",
                            items: {
                              type: "object",
                              properties: {
                                itemName: {
                                  type: "string",
                                  description: "Name of the billed item",
                                },
                                quantity: {
                                  type: "integer",
                                  description: "Quantity of the billed item",
                                },
                                price: {
                                  type: "number",
                                  format: "float",
                                  description: "Price of the billed item",
                                },
                              },
                            },
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the billing record was created",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the billing record was last updated",
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    "get-one-billing": {
                      summary: "Successful response",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          _id: "66b3279c39c21f7342c1520n",
                          patientId: "66b3279c39c21f7342c1520q",
                          receptionistId: "66b3279c39c21f7342c178e",
                          doctorId: "66b3279c39c21f7342c19ac",
                          totalAmount: 3000,
                          billItems: [
                            {
                              _id: "67b9605f11e553a30ad69f88",
                              name: "General Checkup",
                              description: "General checkup for pets",
                              quantity: 1,
                              price: 1500,
                              amount: 1500,
                            },
                            {
                              _id: "67b9605f11e553a30ad69f89",
                              name: "Grooming",
                              description: "Grooming for pets",
                              quantity: 1,
                              price: 1500.5,
                              amount: 1500.5,
                            },
                          ],
                          createdAt: "2025-02-02T08:30:00Z",
                          updatedAt: "2025-02-02T08:30:00Z",
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
      "/v1/admin/followUps/getAll": {
        post: {
          tags: ["admin/followups"],
          summary: "Get all follow-ups",
          security: [{ adminBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    projection: {
                      type: "object",
                      description: "Fields to include in the response",
                    },
                    filter: {
                      type: "object",
                      description:
                        "Filters to apply when retrieving follow-ups",
                    },
                    options: {
                      type: "object",
                      description: "Options for pagination and sorting",
                    },
                    pagination: {
                      type: "object",
                      description: "Pagination settings",
                    },
                    search: {
                      type: "array",
                      description: "Search settings for the request",
                      items: { type: "object" },
                    },
                    date: {
                      type: "string",
                      format: "date-time",
                      description: "Specific date filter",
                    },
                    fromDate: {
                      type: "string",
                      format: "date-time",
                      description: "Starting date filter",
                    },
                    toDate: {
                      type: "string",
                      format: "date-time",
                      description: "Ending date filter",
                    },
                  },
                },
                examples: {
                  projection: {
                    summary: "Projection Example",
                    value: { projection: { patientId: 1, doctorId: 1 } },
                  },
                  date: {
                    summary: "Using Single Date Filter",
                    value: { date: 1738758000 },
                  },
                  dateRange: {
                    summary: "Using Date Range Filter (Epoch Time)",
                    value: { fromDate: 1738368000, toDate: 1739222399 },
                  },
                  pagination: {
                    summary: "Pagination Example",
                    value: { options: { page: 1, itemsPerPage: 10 } },
                  },
                  sortExample: {
                    summary: "Sort Example",
                    value: {
                      options: { sortBy: ["visitDate"], sortDesc: [true] },
                    },
                  },
                  searchExample: {
                    summary: "Search Example",
                    value: {
                      search: [
                        {
                          term: "diagnosis",
                          fields: ["diagnosis", "treatment"],
                          startsWith: true,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get all follow-ups.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "integer",
                        format: "int64",
                        description: "Status code",
                        example: 200,
                      },
                      message: {
                        type: "string",
                        description: "Response message",
                        example: "Success",
                      },
                      data: {
                        type: "object",
                        properties: {
                          totalCount: {
                            type: "integer",
                            description: "Total number of follow-ups",
                          },
                          tableData: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                _id: {
                                  type: "string",
                                  description: "Unique follow-up ID",
                                },
                                patientId: {
                                  type: "string",
                                  description: "Pet ID",
                                },
                                doctorId: {
                                  type: "string",
                                  description: "Doctor ID",
                                },
                                diagnosis: {
                                  type: "string",
                                  description: "Diagnosis details",
                                },
                                treatment: {
                                  type: "string",
                                  description: "Treatment details",
                                },
                                prescription: {
                                  type: "string",
                                  description: "Prescription given",
                                },
                                visitDate: {
                                  type: "string",
                                  format: "date-time",
                                  description: "Visit date timestamp",
                                },
                                createdAt: {
                                  type: "string",
                                  format: "date-time",
                                  description: "Follow-up creation timestamp",
                                },
                                updatedAt: {
                                  type: "string",
                                  format: "date-time",
                                  description: "Last updated timestamp",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    example1: {
                      summary: "Successful response with follow-up data",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          totalCount: 2,
                          tableData: [
                            {
                              _id: "66b3279c39c21f7342c125b4",
                              patientId: "66b3279c39c21f7342c125b4",
                              doctorId: "66b3279c39c21f7342c152c5",
                              diagnosis: "Flu",
                              treatment: "Rest and fluids",
                              prescription: "Vitamin C supplements",
                              visitDate: "2025-02-05T07:00:00Z",
                              createdAt: "2025-02-05T07:30:00Z",
                              updatedAt: "2025-02-06T08:00:00Z",
                            },
                            {
                              _id: "66b3279c39c21f7342c152c5",
                              patientId: "65a3279c39c21f7342c125b4",
                              doctorId: "65b437ac48d21e8343d256c7",
                              diagnosis: "Skin Infection",
                              treatment: "Antibiotic cream",
                              prescription: "Apply twice daily",
                              visitDate: "2025-02-06T10:15:00Z",
                              createdAt: "2025-02-06T11:00:00Z",
                              updatedAt: "2025-02-06T12:30:00Z",
                            },
                          ],
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
      "/v1/admin/followUps/getOne/{id}": {
        post: {
          summary: "Get one follow-up",
          tags: ["admin/followUps"],
          security: [{ adminBearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description:
                "The unique identifier of the follow-up record to retrieve",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    project: {
                      type: "object",
                      description:
                        "Fields to include or exclude in the response",
                    },
                  },
                },
                examples: {
                  projectionExample: {
                    summary: "Example with projection",
                    value: {
                      projection: {
                        _id: 1,
                        patientId: 1,
                        diagnosis: 1,
                        createdAt: 1,
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get one follow-up record.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            format: "ObjectId",
                            description: "Unique ID of the follow-up record",
                          },
                          patientId: {
                            type: "string",
                            format: "ObjectId",
                            description:
                              "Unique ID of the pet associated with the follow-up",
                          },
                          doctorId: {
                            type: "string",
                            format: "ObjectId",
                            description:
                              "Unique ID of the doctor responsible for the follow-up",
                          },
                          diagnosis: {
                            type: "string",
                            description: "Diagnosis of the pet's condition",
                          },
                          treatment: {
                            type: "string",
                            description: "Treatment provided to the pet",
                          },
                          prescription: {
                            type: "string",
                            description: "Prescribed medications for the pet",
                          },
                          visitDate: {
                            type: "string",
                            format: "date",
                            description: "Date of the follow-up visit",
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the follow-up record was created",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the follow-up record was last updated",
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    "get-one-followup": {
                      summary: "Successful response",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          _id: "6512c5f3e4b09a12d8f42b68",
                          patientId: "6512c5f3e4b09a12d8f42b69",
                          doctorId: "6512c5f3e4b09a12d8f42b70",
                          diagnosis: "Skin infection due to allergy",
                          treatment:
                            "Antibiotic injection and medicated shampoo",
                          prescription: "Amoxicillin 250mg, Antihistamines",
                          visitDate: "2024-02-10",
                          createdAt: "2024-02-10T12:00:00Z",
                          updatedAt: "2024-02-11T15:30:00Z",
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
      "/v1/admin/inventory/create": {
        post: {
          summary: "Create a new inventory",
          tags: ["admin/inventory"],
          security: [{ adminBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "price", "quantity"],
                  properties: {
                    name: {
                      type: "string",
                      description: "Name of the inventory item",
                    },
                    price: {
                      type: "number",
                      format: "float",
                      description: "Price of the inventory item",
                    },
                    quantity: {
                      type: "integer",
                      description: "Quantity of the item in stock",
                    },
                    createdAt: {
                      type: "string",
                      format: "date-time",
                      description: "Timestamp when the item was created",
                    },
                    updatedAt: {
                      type: "string",
                      format: "date-time",
                      description: "Timestamp when the item was last updated",
                    },
                  },
                },
                examples: {
                  "Example 1": {
                    summary: "Example of an inventory item",
                    value: { name: "Dog Food", price: 29.99, quantity: 50 },
                  },
                  "Example 2": {
                    summary: "Example of another inventory item",
                    value: { name: "Cat Toy", price: 9.99, quantity: 100 },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Inventory item created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "integer",
                        format: "int64",
                        description: "Status code",
                      },
                      message: {
                        type: "string",
                        description:
                          "Message describing the result of the operation",
                      },
                      data: {
                        type: "string",
                        description: "The response data",
                      },
                      toastMessage: {
                        type: "string",
                        description: "The toast message",
                      },
                    },
                  },
                  examples: {
                    example1: {
                      summary: "Successful inventory item creation response",
                      value: {
                        status: 201,
                        message: "Success",
                        data: "Inventory item created successfully",
                        toastMessage: "Item successfully added to inventory",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/admin/inventory/update/{id}": {
        put: {
          summary: "Update an existing inventory item",
          tags: ["admin/inventory"],
          security: [{ adminBearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "ID of the inventory item to update",
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
                      description: "Updated name of the inventory item",
                    },
                    price: {
                      type: "number",
                      format: "float",
                      description: "Updated price of the inventory item",
                    },
                    quantity: {
                      type: "integer",
                      description: "Updated quantity of the item in stock",
                    },
                    isDeleted: {
                      type: "boolean",
                      description: "Flag to mark item as deleted (soft delete)",
                    },
                    createdAt: {
                      type: "string",
                      format: "date-time",
                      description: "Timestamp when the item was created",
                    },
                    updatedAt: {
                      type: "string",
                      format: "date-time",
                      description: "Timestamp when the item was last updated",
                    },
                  },
                },
                examples: {
                  "Example 1": {
                    summary: "Update inventory item details",
                    value: {
                      name: "Premium Dog Food",
                      price: 34.99,
                      quantity: 40,
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description:
                "Inventory item updated or marked as deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "integer",
                        format: "int64",
                        description: "Status code",
                      },
                      message: {
                        type: "string",
                        description:
                          "Message describing the result of the operation",
                      },
                      data: {
                        type: "string",
                        description: "The response data",
                      },
                      toastMessage: {
                        type: "string",
                        description: "The toast message",
                      },
                    },
                  },
                  examples: {
                    example1: {
                      summary: "Successful inventory update response",
                      value: {
                        status: 200,
                        message: "Success",
                        data: "Inventory item updated successfully",
                        toastMessage: "Item successfully updated",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/admin/inventory/delete/{id}": {
        delete: {
          summary: "Delete an inventory item",
          tags: ["admin/inventory"],
          security: [{ adminBearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "ID of the inventory item to be deleted",
            },
          ],
          responses: {
            200: {
              description: "Inventory item deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "integer",
                        format: "int64",
                        description: "Status code",
                      },
                      message: {
                        type: "string",
                        description:
                          "Message describing the result of the operation",
                      },
                      data: {
                        type: "string",
                        description: "The response data",
                      },
                      toastMessage: {
                        type: "string",
                        description: "The toast message",
                      },
                    },
                  },
                  example: {
                    status: 200,
                    message: "Success",
                    data: "Inventory item permanently deleted",
                    toastMessage: "Item successfully deleted",
                  },
                },
              },
            },
            404: {
              description: "Inventory item not found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      error: { type: "string" },
                    },
                  },
                  example: {
                    status: 404,
                    message: "error",
                    error: "Inventory item not found",
                  },
                },
              },
            },
          },
        },
      },
      "/v1/admin/inventory/getAll": {
        post: {
          tags: ["admin/inventory"],
          summary: "Get all inventory items",
          security: [{ adminBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    projection: {
                      type: "object",
                      description: "Fields to include in the response",
                    },
                    filter: {
                      type: "object",
                      description:
                        "Filters to apply when retrieving inventory items",
                    },
                    options: {
                      type: "object",
                      description: "Options for pagination and sorting",
                    },
                    pagination: {
                      type: "object",
                      description: "Pagination settings",
                    },
                    search: {
                      type: "array",
                      description: "Search settings for the request",
                      items: { type: "object" },
                    },
                    date: {
                      type: "string",
                      format: "date-time",
                      description: "Specific date filter",
                    },
                    fromDate: {
                      type: "string",
                      format: "date-time",
                      description: "Starting date filter",
                    },
                    toDate: {
                      type: "string",
                      format: "date-time",
                      description: "Ending date filter",
                    },
                  },
                },
                examples: {
                  projection: {
                    summary: "Projection Example",
                    value: { projection: { name: 1, price: 1 } },
                  },
                  filterExample: {
                    summary: "Filter Example",
                    value: {
                      filter: { name: { $regex: "Premium", $options: "i" } },
                    },
                  },
                  date: {
                    summary: "Using Single Date Filter",
                    value: { date: 1738758000 },
                  },
                  dateRange: {
                    summary: "Using Date Range Filter (Epoch Time)",
                    value: { fromDate: 1738368000, toDate: 1739222399 },
                  },
                  pagination: {
                    summary: "Pagination Example",
                    value: { options: { page: 1, itemsPerPage: 10 } },
                  },
                  sortExample: {
                    summary: "Sort Example",
                    value: {
                      options: { sortBy: ["createdAt"], sortDesc: [true] },
                    },
                  },
                  searchExample: {
                    summary: "Search Example",
                    value: {
                      search: [
                        {
                          term: "cat",
                          fields: ["name"],
                          startsWith: true,
                          endsWith: false,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get all inventory items.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "integer",
                        format: "int64",
                        description: "Status code",
                        example: 200,
                      },
                      message: {
                        type: "string",
                        description: "Response message",
                        example: "Success",
                      },
                      data: {
                        type: "object",
                        properties: {
                          totalCount: {
                            type: "integer",
                            description: "Total number of inventory items",
                          },
                          tableData: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                _id: {
                                  type: "string",
                                  description: "Unique inventory ID",
                                },
                                name: {
                                  type: "string",
                                  description: "Name of the inventory item",
                                },
                                price: {
                                  type: "number",
                                  description: "Price of the inventory item",
                                },
                                quantity: {
                                  type: "integer",
                                  description: "Quantity available",
                                },
                                createdAt: {
                                  type: "string",
                                  format: "date-time",
                                  description:
                                    "Inventory item creation timestamp",
                                },
                                updatedAt: {
                                  type: "string",
                                  format: "date-time",
                                  description: "Last updated timestamp",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    example1: {
                      summary: "Successful response with inventory data",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          totalCount: 2,
                          tableData: [
                            {
                              _id: "66b3279c39c21f7342c125b4",
                              name: "Laptop",
                              price: 1200.5,
                              quantity: 10,
                              createdAt: "2025-02-05T07:30:00Z",
                              updatedAt: "2025-02-06T08:00:00Z",
                            },
                            {
                              _id: "66b3279c39c21f7342c152c5",
                              name: "Phone",
                              price: 800,
                              quantity: 25,
                              createdAt: "2025-02-06T11:00:00Z",
                              updatedAt: "2025-02-06T12:30:00Z",
                            },
                          ],
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
      "/v1/admin/inventory/getOne/{id}": {
        post: {
          summary: "Get one inventory item",
          tags: ["admin/inventory"],
          security: [{ adminBearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description:
                "The unique identifier of the inventory item to retrieve",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    project: {
                      type: "object",
                      description:
                        "Fields to include or exclude in the response",
                    },
                  },
                },
                examples: {
                  projectionExample: {
                    summary: "Example with projection",
                    value: { projection: { name: 1, price: 1, quantity: 1 } },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get one inventory item.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                            description: "Name of the inventory item",
                          },
                          price: {
                            type: "number",
                            format: "float",
                            description: "Price of the inventory item",
                          },
                          quantity: {
                            type: "integer",
                            format: "int32",
                            description: "Quantity available in stock",
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the inventory item was created",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the inventory item was last updated",
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    "get-one-inventory": {
                      summary: "Successful response",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          name: "Dog Food - Premium",
                          price: 29.99,
                          quantity: 50,
                          createdAt: "2024-02-10T12:00:00Z",
                          updatedAt: "2024-02-11T15:30:00Z",
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
      "/v1/admin/patients/getAll": {
        post: {
          tags: ["admin/patients"],
          security: [{ adminBearerAuth: [] }],
          summary: "Get all",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    projection: {
                      type: "object",
                      description:
                        "Fields to include in the response (projection)",
                    },
                    filter: {
                      type: "object",
                      description: "Filters to apply when retrieving patients",
                    },
                    options: {
                      type: "object",
                      description: "Options for pagination and sorting",
                    },
                    pagination: {
                      type: "object",
                      description: "Pagination settings for the response",
                    },
                    search: {
                      type: "array",
                      description: "Search settings for the request",
                      items: { type: "object" },
                    },
                    date: {
                      type: "integer",
                      description: "The specific date in Unix timestamp format",
                    },
                    fromDate: {
                      type: "integer",
                      description: "The starting date in Unix timestamp format",
                    },
                    toDate: {
                      type: "integer",
                      description: "The ending date in Unix timestamp format",
                    },
                  },
                },
                examples: {
                  projectionExample: {
                    summary: "Projection Example",
                    value: {
                      projection: {
                        _id: 1,
                        name: 1,
                        species: 1,
                        breed: 1,
                        age: 1,
                        weight: 1,
                        gender: 1,
                        medicalHistory: 1,
                        bmi: 1,
                        bloodGroup: 1,
                      },
                    },
                  },
                  filterExample: {
                    summary: "filter example",
                    value: { filter: { name: "rammy" } },
                  },
                  singleDateExample: {
                    summary: "Multi-date Example",
                    value: { date: 1738658701 },
                  },
                  multiDateExample: {
                    summary: "Single-date Example",
                    value: { fromDate: 1707036301, toDate: 1738658701 },
                  },
                  pagination: {
                    summary: "Pagination Example",
                    value: { options: { page: 1, itemsPerPage: 10 } },
                  },
                  sortExample: {
                    summary: "Sort Example",
                    value: {
                      options: { sortBy: ["createdAt"], sortDesc: [true] },
                    },
                  },
                  searchExample: {
                    summary: "Search Example",
                    value: {
                      search: [
                        {
                          term: "Golden Retriever",
                          fields: ["breed"],
                          startsWith: true,
                          endsWith: false,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get all patients.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          totalCount: {
                            type: "integer",
                            description: "Total number of patients",
                          },
                          tableData: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                _id: {
                                  type: "string",
                                  description: "The unique ID of the patient",
                                },
                                name: {
                                  type: "string",
                                  description: "The name of the patient",
                                },
                                species: {
                                  type: "string",
                                  description: "The species of the patient",
                                },
                                breed: {
                                  type: "string",
                                  description: "The breed of the patient",
                                },
                                age: {
                                  type: "integer",
                                  description: "The age of the patient",
                                },
                                weight: {
                                  type: "number",
                                  format: "float",
                                  description: "The weight of the patient",
                                },
                                gender: {
                                  type: "string",
                                  enum: ["MALE", "FEMALE"],
                                  description: "The gender of the patient",
                                },
                                medicalHistory: {
                                  type: "string",
                                  description:
                                    "The medical history of the patient",
                                },
                                BMI: {
                                  type: "number",
                                  format: "float",
                                  description: "The BMI of the patient",
                                },
                                bloodGroup: {
                                  type: "string",
                                  enum: [
                                    "DEA 1.1+",
                                    "DEA 1.1-",
                                    "DEA 1.2+",
                                    "DEA 1.2-",
                                    "DEA 3",
                                    "DEA 4",
                                    "DEA 5",
                                    "DEA 7",
                                    "A",
                                    "B",
                                    "AB",
                                  ],
                                  description: "The blood group of the patient",
                                },
                                createdAt: {
                                  type: "string",
                                  format: "date-time",
                                  description:
                                    "Timestamp when the patient record was created",
                                },
                                updatedAt: {
                                  type: "string",
                                  format: "date-time",
                                  description:
                                    "Timestamp when the patient record was last updated",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    example1: {
                      summary: "Successful response with data",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          totalCount: 2,
                          tableData: [
                            {
                              _id: "66b3279c39c21f7342c125b4",
                              name: "Buddy",
                              species: "Dog",
                              breed: "Golden Retriever",
                              age: 5,
                              weight: 30.5,
                              gender: "MALE",
                              medicalHistory: "No known issues",
                              bmi: 24.7,
                              bloodGroup: "DEA 1.1+",
                              createdAt: "2025-02-01T08:00:00Z",
                              updatedAt: "2025-02-01T08:00:00Z",
                            },
                            {
                              _id: "66b3279c39c21f7342c1520n",
                              name: "Mittens",
                              species: "Cat",
                              breed: "Persian",
                              age: 3,
                              weight: 4.8,
                              gender: "FEMALE",
                              medicalHistory: "Allergic to certain foods",
                              bmi: 22.1,
                              bloodGroup: "A",
                              createdAt: "2025-02-01T08:00:00Z",
                              updatedAt: "2025-02-01T08:00:00Z",
                            },
                          ],
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
      "/v1/admin/patients/getOne/{id}": {
        post: {
          tags: ["admin/patients"],
          security: [{ adminBearerAuth: [] }],
          summary: "Get one",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "The unique identifier of the patient to retrieve",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    project: {
                      type: "object",
                      description:
                        "Fields to include or exclude in the response",
                    },
                  },
                },
                examples: {
                  projectionExample: {
                    summary: "Example with projection",
                    value: { projection: { _id: 1, name: 1 } },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get one patient.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            description: "The unique ID of the patient",
                          },
                          name: {
                            type: "string",
                            description: "The name of the patient",
                          },
                          species: {
                            type: "string",
                            description: "The species of the patient",
                          },
                          breed: {
                            type: "string",
                            description: "The breed of the patient",
                          },
                          age: {
                            type: "integer",
                            description: "The age of the patient",
                          },
                          weight: {
                            type: "number",
                            format: "float",
                            description: "The weight of the patient",
                          },
                          gender: {
                            type: "string",
                            enum: ["MALE", "FEMALE"],
                            description: "The gender of the patient",
                          },
                          medicalHistory: {
                            type: "array",
                            items: { type: "string" },
                            description: "The medical history of the patient",
                          },
                          BMI: {
                            type: "number",
                            format: "float",
                            description: "The BMI of the patient",
                          },
                          bloodGroup: {
                            type: "string",
                            enum: [
                              "DEA 1.1+",
                              "DEA 1.1-",
                              "DEA 1.2+",
                              "DEA 1.2-",
                              "DEA 3",
                              "DEA 4",
                              "DEA 5",
                              "DEA 7",
                              "A",
                              "B",
                              "AB",
                            ],
                            description: "The blood group of the patient",
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the patient record was created",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the patient record was last updated",
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    "get-one-patient": {
                      summary: "Successful response",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          _id: "66b3279c39c21f7342c1520p",
                          name: "Buddy",
                          species: "Dog",
                          breed: "Labrador Retriever",
                          age: 5,
                          weight: 30.5,
                          gender: "MALE",
                          medicalHistory: "Vaccinated, No known allergies",
                          BMI: 23.4,
                          bloodGroup: "DEA 1.1+",
                          createdAt: "2025-02-01T08:00:00Z",
                          updatedAt: "2025-02-01T08:00:00Z",
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
      "/v1/admin/payments/getAll": {
        post: {
          tags: ["admin/payments"],
          security: [{ adminBearerAuth: [] }],
          summary: "Get all",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    projection: {
                      type: "object",
                      description:
                        "Fields to include in the response (projection)",
                    },
                    filter: {
                      type: "object",
                      description: "Filters to apply when retrieving payments",
                    },
                    options: {
                      type: "object",
                      description: "Options for pagination and sorting",
                    },
                    pagination: {
                      type: "object",
                      description: "Pagination settings for the response",
                    },
                    search: {
                      type: "array",
                      description: "Search settings for the request",
                      items: { type: "object" },
                    },
                    date: {
                      type: "integer",
                      description: "The specific date in Unix timestamp format",
                    },
                    fromDate: {
                      type: "integer",
                      description: "The starting date in Unix timestamp format",
                    },
                    toDate: {
                      type: "integer",
                      description: "The ending date in Unix timestamp format",
                    },
                  },
                },
                examples: {
                  projectionExample: {
                    summary: "Projection Example",
                    value: {
                      projection: {
                        _id: 1,
                        appointmentId: 1,
                        amount: 1,
                        paymentStatus: 1,
                        referenceNo: 1,
                        createdAt: 1,
                        updatedAt: 1,
                      },
                    },
                  },
                  singleDateExample: {
                    summary: "Single-date Example",
                    value: { date: 1738658701 },
                  },
                  multiDateExample: {
                    summary: "Multi-date Example",
                    value: { fromDate: 1707036301, toDate: 1738658701 },
                  },
                  pagination: {
                    summary: "Pagination Example",
                    value: { options: { page: 1, itemsPerPage: 10 } },
                  },
                  sortExample: {
                    summary: "Sort Example",
                    value: {
                      options: { sortBy: ["createdAt"], sortDesc: [true] },
                    },
                  },
                  searchExample: {
                    summary: "Search Example",
                    value: {
                      search: [
                        {
                          term: "PAID",
                          fields: ["paymentStatus"],
                          startsWith: true,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get all payments.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          totalCount: {
                            type: "integer",
                            description: "Total number of payments",
                          },
                          tableData: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                _id: {
                                  type: "string",
                                  description: "The unique ID of the payment",
                                },
                                appointmentId: {
                                  type: "string",
                                  description:
                                    "The appointment ID associated with the payment",
                                },
                                amount: {
                                  type: "number",
                                  format: "float",
                                  description: "The payment amount",
                                },
                                paymentStatus: {
                                  type: "string",
                                  enum: ["PENDING", "PAID", "CANCELLED"],
                                  description: "The payment status",
                                },
                                reference_no: {
                                  type: "string",
                                  description: "The payment reference number",
                                },
                                createdAt: {
                                  type: "string",
                                  format: "date-time",
                                  description:
                                    "Timestamp when the payment record was created",
                                },
                                updatedAt: {
                                  type: "string",
                                  format: "date-time",
                                  description:
                                    "Timestamp when the payment record was last updated",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    example1: {
                      summary: "Successful response with data",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          totalCount: 2,
                          tableData: [
                            {
                              _id: "66b3279c39c21f7342c125b4",
                              appointmentId: "66b3279c39c21f7342c12000",
                              amount: 100.5,
                              paymentStatus: "PAID",
                              referenceNo: "PAY123456",
                              createdAt: "2025-02-01T08:00:00Z",
                              updatedAt: "2025-02-01T08:00:00Z",
                            },
                            {
                              _id: "66b3279c39c21f7342c1520n",
                              appointmentId: "66b3279c39c21f7342c12001",
                              amount: 200,
                              paymentStatus: "PENDING",
                              reference_no: "PAY789012",
                              createdAt: "2025-02-01T08:00:00Z",
                              updatedAt: "2025-02-01T08:00:00Z",
                            },
                          ],
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
      "/v1/admin/payments/getOne/{id}": {
        post: {
          tags: ["admin/payments"],
          security: [{ adminBearerAuth: [] }],
          summary: "Get one",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "The unique identifier of the payment to retrieve",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    projection: {
                      type: "object",
                      description:
                        "Fields to include or exclude in the response",
                    },
                  },
                },
                examples: {
                  projectionExample: {
                    summary: "Example with projection",
                    value: { projection: { _id: 1, amount: 1 } },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get one payment.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            description: "The unique ID of the payment",
                          },
                          appointmentId: {
                            type: "string",
                            description:
                              "The appointment ID related to the payment",
                          },
                          amount: {
                            type: "number",
                            format: "float",
                            description: "The payment amount",
                          },
                          paymentStatus: {
                            type: "string",
                            enum: ["PENDING", "PAID", "CANCELLED"],
                            description: "The status of the payment",
                          },
                          reference_no: {
                            type: "string",
                            description: "Reference number for the payment",
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the payment record was created",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the payment record was last updated",
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    "get-one-payment": {
                      summary: "Successful response",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          _id: "66b3279c39c21f7342c1520p",
                          appointmentId: "66b3279c39c21f7342c1abc3",
                          amount: 1500.5,
                          paymentStatus: "PAID",
                          reference_no: "PAY123456789",
                          createdAt: "2025-02-01T08:00:00Z",
                          updatedAt: "2025-02-01T08:00:00Z",
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
      "/v1/admin/users/create": {
        post: {
          summary: "Create a new user",
          tags: ["admin/users"],
          security: [{ adminBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password", "role"],
                  properties: {
                    name: { type: "string" },
                    email: { type: "string", format: "email" },
                    password: { type: "string" },
                    role: {
                      type: "string",
                      enum: ["DOCTOR", "RECEPTIONIST", "NURSE"],
                    },
                  },
                },
                examples: {
                  Doctor: {
                    summary: "Example of a Doctor user",
                    value: {
                      name: "Dr. Jane Doe",
                      email: "jane.doe@example.com",
                      password: "securepassword",
                      role: "DOCTOR",
                    },
                  },
                  Receptionist: {
                    summary: "Example of a Receptionist user",
                    value: {
                      name: "Lisa Thompson",
                      email: "lisa.thompson@example.com",
                      password: "securepassword",
                      role: "RECEPTIONIST",
                    },
                  },
                  Nurse: {
                    summary: "Example of a Nurse user",
                    value: {
                      name: "Michael Johnson",
                      email: "michael.johnson@example.com",
                      password: "securepassword",
                      role: "NURSE",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "User created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "integer",
                        format: "int64",
                        description: "Status code",
                      },
                      message: {
                        type: "string",
                        description:
                          "Message describing the result of the operation",
                      },
                      data: {
                        type: "string",
                        description: "The response data",
                      },
                      toastMessage: {
                        type: "string",
                        description: "The toast message",
                      },
                    },
                  },
                  examples: {
                    example1: {
                      summary: "Successful user creation response",
                      value: {
                        status: 201,
                        message: "Success",
                        data: "User created successfully",
                        toastMessage: "User successfully created",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/admin/users/update/{id}": {
        put: {
          summary: "Update an existing user",
          tags: ["admin/users"],
          security: [{ adminBearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "The unique identifier of the user",
              example: "6512c5f3e4b09a12d8f42b68",
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
                      description: "Updated name of the user (optional)",
                      example: "Dr. Jane Doe",
                    },
                    email: {
                      type: "string",
                      format: "email",
                      description: "Updated email address (optional)",
                      example: "jane.doe@example.com",
                    },
                    role: {
                      type: "string",
                      enum: ["DOCTOR", "RECEPTIONIST", "NURSE"],
                      description: "Updated role of the user (optional)",
                      example: "NURSE",
                    },
                    isDeleted: {
                      type: "boolean",
                      description: "Mark the user as deleted (optional)",
                      example: false,
                    },
                  },
                },
                examples: {
                  UpdateNameAndRole: {
                    summary: "Example of updating name and role",
                    value: { name: "Dr. Jane Doe", role: "NURSE" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "User updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "integer",
                        format: "int64",
                        description: "Status code",
                        example: 200,
                      },
                      message: {
                        type: "string",
                        description:
                          "Message describing the result of the operation",
                        example: "Success",
                      },
                      data: {
                        type: "string",
                        description: "The response data",
                        example: "User updated successfully",
                      },
                      toastMessage: {
                        type: "string",
                        description: "The toast message",
                        example: "User successfully updated",
                      },
                    },
                  },
                  examples: {
                    example1: {
                      summary: "Successful user update response",
                      value: {
                        status: 200,
                        message: "Success",
                        data: "User updated successfully",
                        toastMessage: "User successfully updated",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/admin/users/delete/{id}": {
        delete: {
          summary: "Delete a user",
          tags: ["admin/users"],
          security: [{ adminBearerAuth: [] }],
          parameters: [
            {
              in: "query",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "The unique identifier of the user to be deleted",
              example: "6512c5f3e4b09a12d8f42b68",
            },
          ],
          responses: {
            200: {
              description: "User deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "integer",
                        format: "int64",
                        description: "Status code",
                        example: 200,
                      },
                      message: {
                        type: "string",
                        description:
                          "Message describing the result of the operation",
                        example: "Success",
                      },
                      data: {
                        type: "string",
                        description: "The response data",
                        example: "User deleted successfully",
                      },
                      toastMessage: {
                        type: "string",
                        description: "The toast message",
                        example: "User successfully deleted",
                      },
                    },
                  },
                  examples: {
                    example1: {
                      summary: "Successful user deletion response",
                      value: {
                        status: 200,
                        message: "Success",
                        data: "User deleted successfully",
                        toastMessage: "User successfully deleted",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/admin/users/getAll": {
        post: {
          tags: ["admin/users"],
          summary: "Get all users",
          security: [{ adminBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    projection: {
                      type: "object",
                      description: "Fields to include in the response",
                    },
                    filter: {
                      type: "object",
                      description: "Filters to apply when retrieving users",
                    },
                    options: {
                      type: "object",
                      description: "Options for pagination and sorting",
                    },
                    pagination: {
                      type: "object",
                      description: "Pagination settings",
                    },
                    search: {
                      type: "array",
                      description: "Search settings for the request",
                      items: { type: "object" },
                    },
                    date: {
                      type: "string",
                      format: "date-time",
                      description: "Specific date filter",
                    },
                    fromDate: {
                      type: "string",
                      format: "date-time",
                      description: "Starting date filter",
                    },
                    toDate: {
                      type: "string",
                      format: "date-time",
                      description: "Ending date filter",
                    },
                  },
                },
                examples: {
                  projection: {
                    summary: "Projection Example",
                    value: { projection: { name: 1, email: 1 } },
                  },
                  date: {
                    summary: "Using Single Date Filter",
                    value: { date: 1738758000 },
                  },
                  dateRange: {
                    summary: "Using Date Range Filter (Epoch Time)",
                    value: { fromDate: 1738368000, toDate: 1739222399 },
                  },
                  pagination: {
                    summary: "Pagination Example",
                    value: { options: { page: 1, itemsPerPage: 10 } },
                  },
                  sortExample: {
                    summary: "Sort Example",
                    value: {
                      options: { sortBy: ["createdAt"], sortDesc: [true] },
                    },
                  },
                  searchExample: {
                    summary: "Search Example",
                    value: {
                      search: [
                        {
                          term: "john",
                          fields: ["name", "email"],
                          startsWith: true,
                          endsWith: true,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get all users.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "integer",
                        format: "int64",
                        description: "Status code",
                        example: 200,
                      },
                      message: {
                        type: "string",
                        description: "Response message",
                        example: "Success",
                      },
                      data: {
                        type: "object",
                        properties: {
                          totalCount: {
                            type: "integer",
                            description: "Total number of users",
                          },
                          tableData: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                _id: {
                                  type: "string",
                                  description: "Unique user ID",
                                },
                                name: {
                                  type: "string",
                                  description: "User's name",
                                },
                                email: {
                                  type: "string",
                                  description: "User's email",
                                },
                                role: {
                                  type: "string",
                                  description: "User role",
                                },
                                createdAt: {
                                  type: "string",
                                  format: "date-time",
                                  description: "User creation timestamp",
                                },
                                updatedAt: {
                                  type: "string",
                                  format: "date-time",
                                  description: "Last updated timestamp",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    example1: {
                      summary: "Successful response with user data",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          totalCount: 2,
                          tableData: [
                            {
                              _id: "66b3279c39c21f7342c125b4",
                              name: "John Doe",
                              email: "john.doe@example.com",
                              role: "DOCTOR",
                              createdAt: "2025-02-05T07:00:00Z",
                              updatedAt: "2025-02-05T07:30:00Z",
                            },
                            {
                              _id: "66b3279c39c21f7342c152c5",
                              name: "Jane Smith",
                              email: "jane.smith@example.com",
                              role: "RECEPTIONIST",
                              createdAt: "2025-02-06T10:15:00Z",
                              updatedAt: "2025-02-06T11:00:00Z",
                            },
                          ],
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
      "/v1/admin/users/getOne/{id}": {
        post: {
          tags: ["admin/users"],
          summary: "Get one user",
          security: [{ adminBearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "The unique identifier of the user to retrieve",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    project: {
                      type: "object",
                      description:
                        "Fields to include or exclude in the response",
                    },
                  },
                },
                examples: {
                  projectionExample: {
                    summary: "Example with projection",
                    value: { projection: { _id: 1, createdAt: 1 } },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get one.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            format: "ObjectId",
                            description: "The unique ID of the user",
                          },
                          name: { type: "string", description: "User's name" },
                          email: {
                            type: "string",
                            description: "User's email",
                          },
                          role: { type: "string", description: "User role" },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "Timestamp when the user was created",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the user was last updated",
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    "get-one-user": {
                      summary: "Successful response",
                      value: {
                        status: 200,
                        message: "success",
                        data: {
                          _id: "66b3279c39c21f7342c100c3",
                          name: "John Doe",
                          email: "john.doe@example.com",
                          role: "DOCTOR",
                          createdAt: "2024-02-04T12:00:00.000Z",
                          updatedAt: "2024-02-04T12:00:00.000Z",
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
      "/v1/doctor/appointments/update/{_id}": {
        put: {
          tags: ["doctor/appointments"],
          summary: "Update an appointment record",
          security: [{ doctorBearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "_id",
              required: true,
              schema: { type: "string" },
              description:
                "The unique identifier of the appointment to retrieve",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["remarks"],
                  properties: {
                    remarks: {
                      type: "string",
                      description: "remarks related to the appointment",
                    },
                  },
                },
                examples: {
                  updateAppointment: {
                    summary: "Example request body for updating an appointment",
                    value: { remarks: "the patient needs an surgery" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Appointment record created/updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "integer",
                        format: "int64",
                        description: "Status code",
                      },
                      message: {
                        type: "string",
                        description:
                          "Message describing the result of the operation",
                      },
                      data: {
                        type: "object",
                        description:
                          "The created or updated appointment record",
                      },
                      toastMessage: {
                        type: "string",
                        description: "The message that is sent",
                      },
                    },
                  },
                  examples: {
                    updateExample: {
                      summary:
                        "Successful response for updating an appointment",
                      value: {
                        status: 200,
                        message: "Success",
                        data: "Appointment record updated successfully",
                        toastMessage: "Appointment record updated successfully",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/doctor/appointments/getOne/{id}": {
        post: {
          summary: "Get one appointment",
          tags: ["doctor/appointments"],
          security: [{ doctorBearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description:
                "The unique identifier of the follow-up record to retrieve",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    project: {
                      type: "object",
                      description:
                        "Fields to include or exclude in the response",
                    },
                  },
                },
                examples: {
                  projectionExample: {
                    summary: "Example with projection",
                    value: {
                      projection: {
                        _id: 1,
                        patientId: 1,
                        doctorId: 1,
                        nurseId: 1,
                        date: 1,
                        status: 1,
                        remarks: 1,
                        createdAt: 1,
                        updatedAt: 1,
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get one follow-up record.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            format: "ObjectId",
                            description: "Unique ID of the follow-up record",
                          },
                          petId: {
                            type: "string",
                            format: "ObjectId",
                            description:
                              "Unique ID of the pet associated with the follow-up",
                          },
                          doctorId: {
                            type: "string",
                            format: "ObjectId",
                            description:
                              "Unique ID of the doctor responsible for the follow-up",
                          },
                          date: {
                            type: "string",
                            description: "date of he patients appointment",
                          },
                          status: {
                            type: "string",
                            description: "Treatment provided to the pet",
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the follow-up record was created",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the follow-up record was last updated",
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    "get-one-followup": {
                      summary: "Successful response",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          _id: "6512c5f3e4b09a12d8f42b68",
                          petId: "6512c5f3e4b09a12d8f42b69",
                          doctorId: "6512c5f3e4b09a12d8f42b70",
                          date: "2025-03-01T10:00:00.000+00:00",
                          status: "SCHEDULED",
                          createdAt: "2024-02-10T12:00:00Z",
                          updatedAt: "2024-02-11T15:30:00Z",
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
      "/v1/doctor/appointments/getall": {
        post: {
          tags: ["doctor/appointments"],
          summary: "Get all appointments",
          security: [{ doctorBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    projection: {
                      type: "object",
                      description: "Fields to include in the response",
                    },
                    filter: {
                      type: "object",
                      description:
                        "Filters to apply when retrieving follow-ups",
                    },
                    options: {
                      type: "object",
                      description: "Options for pagination and sorting",
                    },
                    pagination: {
                      type: "object",
                      description: "Pagination settings",
                    },
                    search: {
                      type: "array",
                      description: "Search settings for the request",
                      items: { type: "object" },
                    },
                    date: {
                      type: "number",
                      format: "date-time",
                      description: "Specific date filter",
                    },
                    fromDate: {
                      type: "number",
                      format: "date-time",
                      description: "Starting date filter",
                    },
                    toDate: {
                      type: "number",
                      format: "date-time",
                      description: "Ending date filter",
                    },
                  },
                },
                examples: {
                  projection: {
                    summary: "Projection Example",
                    value: { projection: { petId: 1, doctorId: 1 } },
                  },
                  date: {
                    summary: "Using Single Date Filter",
                    value: { date: 1738758000 },
                  },
                  dateRange: {
                    summary: "Using Date Range Filter (Epoch Time)",
                    value: { fromDate: 1738368000, toDate: 1739222399 },
                  },
                  pagination: {
                    summary: "Pagination Example",
                    value: { options: { page: 1, itemsPerPage: 10 } },
                  },
                  sortExample: {
                    summary: "Sort Example",
                    value: { options: { sortBy: ["date"], sortDesc: [true] } },
                  },
                  searchExample: {
                    summary: "Search Example",
                    value: {
                      search: [
                        {
                          term: "CANCELLED",
                          fields: ["status"],
                          startsWith: true,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get all follow-ups.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "integer",
                        format: "int64",
                        description: "Status code",
                        example: 200,
                      },
                      message: {
                        type: "string",
                        description: "Response message",
                        example: "Success",
                      },
                      data: {
                        type: "object",
                        properties: {
                          totalCount: {
                            type: "integer",
                            description: "Total number of follow-ups",
                          },
                          tableData: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                _id: {
                                  type: "string",
                                  format: "ObjectId",
                                  description:
                                    "Unique ID of the follow-up record",
                                },
                                petId: {
                                  type: "string",
                                  format: "ObjectId",
                                  description:
                                    "Unique ID of the pet associated with the follow-up",
                                },
                                doctorId: {
                                  type: "string",
                                  format: "ObjectId",
                                  description:
                                    "Unique ID of the doctor responsible for the follow-up",
                                },
                                date: {
                                  type: "string",
                                  description:
                                    "date of the patients appointment",
                                },
                                status: {
                                  type: "string",
                                  enum: ["SCHEDULED", "COMPLETED", "CANCELLED"],
                                  description: "Treatment provided to the pet",
                                },
                                createdAt: {
                                  type: "string",
                                  format: "date-time",
                                  description:
                                    "Timestamp when the follow-up record was created",
                                },
                                updatedAt: {
                                  type: "string",
                                  format: "date-time",
                                  description:
                                    "Timestamp when the follow-up record was last updated",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    example1: {
                      summary: "Successful response with follow-up data",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          totalCount: 2,
                          tableData: [
                            {
                              _id: "66b3279c39c21f7342c125b4",
                              petId: "6512c5f3e4b09a12d8f42b69",
                              doctorId: "6512c5f3e4b09a12d8f42b70",
                              date: "2025-03-01T10:00:00.000+00:00",
                              status: "SCHEDULED",
                              createdAt: "2024-02-10T12:00:00Z",
                              updatedAt: "2024-02-11T15:30:00Z",
                            },
                            {
                              _id: "67b9b29b0b78abeac1a39dbb",
                              petId: "6512c5f3e4b09a12d8f42b69",
                              doctorId: "6512c5f3e4b09a12d8f42b70",
                              date: "2025-03-01T10:00:00.000+00:00",
                              status: "CANCELLED",
                              createdAt: "2024-02-10T12:00:00Z",
                              updatedAt: "2024-02-11T15:30:00Z",
                            },
                          ],
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
      "/v1/doctor/auth/login": {
        post: {
          summary: "login",
          tags: ["doctor/auth"],
          security: [{ doctorBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", example: "password@example.com" },
                    password: { type: "string", example: "Doctor@123" },
                  },
                },
                example: {
                  email: "password@example.com",
                  password: "password",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: { type: "string", example: "Success" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            example: "6512c5f3e4b09a12d8f42b68",
                          },
                          name: { type: "string", example: "Alex" },
                          email: {
                            type: "string",
                            example: "alex@example.com",
                          },
                          role: { type: "string", example: "ADMIN" },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-02-06T15:30:00Z",
                          },
                          access_token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                          },
                          refresh_token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                          },
                          tokenExpiresAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-07-15T12:57:10.956Z",
                          },
                        },
                      },
                      toastMessage: {
                        type: "string",
                        example: "Login successful",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/doctor/auth/logout": {
        post: {
          summary: "logout",
          tags: ["doctor/auth"],
          security: [{ doctorBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    refresh_token: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Logout successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: { type: "string", example: "Success" },
                      data: {
                        type: "string",
                        example: "Admin logged out successfully",
                      },
                      toastMessage: {
                        type: "string",
                        example: "Admin logged out successfully",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/doctor/auth/profile": {
        post: {
          summary: "Get user profile",
          tags: ["doctor/auth"],
          security: [{ doctorBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    project: {
                      type: "object",
                      description: "Projection fields (optional)",
                      properties: {
                        _id: { type: "integer", example: 1 },
                        name: { type: "integer", example: 1 },
                        email: { type: "integer", example: 1 },
                        role: { type: "integer", example: 1 },
                        isVerified: { type: "integer", example: 1 },
                        createdAt: { type: "integer", example: 1 },
                        updatedAt: { type: "integer", example: 1 },
                      },
                    },
                  },
                },
                examples: {
                  fullProjection: {
                    summary: "Full data projection (Retrieve all fields)",
                    value: {
                      project: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        role: 1,
                        createdAt: 1,
                        updatedAt: 1,
                      },
                    },
                  },
                  limitedProjection: {
                    summary:
                      "Limited data projection (Retrieve only _id and createdAt)",
                    value: { project: { _id: 1, createdAt: 1 } },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "User profile retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: { type: "string", example: "Success" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            example: "6512c5f3e4b09a12d8f42b68",
                          },
                          name: { type: "string", example: "Admin User" },
                          email: {
                            type: "string",
                            example: "admin@example.com",
                          },
                          role: { type: "string", example: "ADMIN" },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-02-05T12:00:00Z",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-02-06T15:30:00Z",
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    fullResponse: {
                      summary: "Full response (all fields)",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          _id: "6512c5f3e4b09a12d8f42b68",
                          name: "Admin User",
                          email: "admin@example.com",
                          role: "ADMIN",
                          createdAt: "2024-02-05T12:00:00Z",
                          updatedAt: "2024-02-06T15:30:00Z",
                        },
                      },
                    },
                    limitedResponse: {
                      summary: "Limited response (only _id and createdAt)",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          _id: "6512c5f3e4b09a12d8f42b68",
                          createdAt: "2024-02-05T12:00:00Z",
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
      "/v1/doctor/auth/update/": {
        put: {
          summary: "Update user profile",
          tags: ["doctor/auth"],
          security: [{ doctorBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "Alex" },
                    email: { type: "string", example: "alex@example.com" },
                  },
                },
                examples: {
                  fullUpdate: {
                    summary: "Full profile update",
                    value: { name: "Alex", email: "alex@example.com" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "User profile updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: { type: "string", example: "Success" },
                      data: { type: "string", example: "Updated successfully" },
                      toastMessage: {
                        type: "string",
                        example: "Updated successfully",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/doctor/auth/refresh": {
        post: {
          summary: "Refresh user token",
          tags: ["doctor/auth"],
          security: [{ doctorBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    refresh_token: {
                      type: "string",
                      example:
                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV2CJ9.eyJpYXQiOjE3MTg0NTYyMzEsImV4cCI6MjAzMzgxNjIzMX0.Po_Xc3McuJt4GhKWpd1B5cUcHsdZWq_4ElO138VmsU",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Token refreshed successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: { type: "string", example: "Success" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            example: "6512c5f3e4b09a12d8f42b68",
                          },
                          name: { type: "string", example: "Admin User" },
                          email: {
                            type: "string",
                            example: "admin@example.com",
                          },
                          role: { type: "string", example: "ADMIN" },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-02-05T12:00:00Z",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-02-06T15:30:00Z",
                          },
                          access_token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV2CJ9...",
                          },
                          refresh_token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV2CJ9...",
                          },
                          tokenExpiresAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-07-15T12:57:10.956Z",
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
      },
      "/v1/doctor/followUps/createupdate": {
        post: {
          summary: "Create a new follow-up record",
          tags: ["doctor/followups"],
          security: [{ doctorBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "patientId",
                    "doctorId",
                    "diagnosis",
                    "treatment",
                    "prescription",
                    "visitDate",
                  ],
                  properties: {
                    patientId: {
                      type: "string",
                      format: "ObjectId",
                      description:
                        "Unique ID of the pet associated with the follow-up",
                    },
                    doctorId: {
                      type: "string",
                      format: "ObjectId",
                      description:
                        "Unique ID of the doctor responsible for the follow-up",
                    },
                    diagnosis: {
                      type: "string",
                      description: "Diagnosis of the pet's condition",
                    },
                    treatment: {
                      type: "string",
                      description: "Treatment provided to the pet",
                    },
                    prescription: {
                      type: "string",
                      description: "Prescribed medications for the pet",
                    },
                    visitDate: {
                      type: "string",
                      format: "date",
                      description: "Date of the follow-up visit",
                    },
                  },
                },
                examples: {
                  "create example": {
                    summary: "Example of a follow-up record",
                    value: {
                      patientId: "67c1408cb2c2f6be65087847",
                      diagnosis: "Skin infection due to allergy",
                      treatment: "Antibiotic injection and medicated shampoo",
                      prescription: "Amoxicillin 250mg, Antihistamines",
                      visitDate: "2024-02-10",
                    },
                  },
                  "update example": {
                    summary: "Another example of a follow-up record",
                    value: {
                      id: "67bdace8322f42e09ffb8a18",
                      patientId: "67c1408cb2c2f6be65087847",
                      doctorId: "67bc480859691058622faf3e",
                      diagnosis: "Ear infection",
                      treatment: "Ear drops and pain relief medication",
                      prescription: "Otibiotic ointment, Ibuprofen",
                      visitDate: "2024-03-15",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Follow-up record created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "integer",
                        format: "int64",
                        description: "Status code",
                      },
                      message: {
                        type: "string",
                        description:
                          "Message describing the result of the operation",
                      },
                      data: {
                        type: "string",
                        description: "The response data",
                      },
                      toastMessage: {
                        type: "string",
                        description: "The toast message",
                      },
                    },
                  },
                  examples: {
                    "create example": {
                      summary: "Successful follow-up record creation response",
                      value: {
                        status: 201,
                        message: "Success",
                        data: "Follow-up record created successfully",
                        toastMessage: "Follow-up recorded successfully",
                      },
                    },
                    "update example": {
                      summary: "Successful follow-up record creation response",
                      value: {
                        status: 201,
                        message: "Success",
                        data: "Follow-up record created successfully",
                        toastMessage: "Follow-up recorded successfully",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/doctor/followUps/getOne/{id}": {
        post: {
          summary: "Get one follow-up",
          tags: ["doctor/followups"],
          security: [{ doctorBearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description:
                "The unique identifier of the follow-up record to retrieve",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    project: {
                      type: "object",
                      description:
                        "Fields to include or exclude in the response",
                    },
                  },
                },
                examples: {
                  projectionExample: {
                    summary: "Example with projection",
                    value: {
                      projection: {
                        _id: 1,
                        patientId: 1,
                        diagnosis: 1,
                        createdAt: 1,
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get one follow-up record.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            format: "ObjectId",
                            description: "Unique ID of the follow-up record",
                          },
                          patientId: {
                            type: "string",
                            format: "ObjectId",
                            description:
                              "Unique ID of the pet associated with the follow-up",
                          },
                          doctorId: {
                            type: "string",
                            format: "ObjectId",
                            description:
                              "Unique ID of the doctor responsible for the follow-up",
                          },
                          diagnosis: {
                            type: "string",
                            description: "Diagnosis of the pet's condition",
                          },
                          treatment: {
                            type: "string",
                            description: "Treatment provided to the pet",
                          },
                          prescription: {
                            type: "string",
                            description: "Prescribed medications for the pet",
                          },
                          visitDate: {
                            type: "string",
                            format: "date",
                            description: "Date of the follow-up visit",
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the follow-up record was created",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the follow-up record was last updated",
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    "get-one-followup": {
                      summary: "Successful response",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          _id: "6512c5f3e4b09a12d8f42b68",
                          patientId: "6512c5f3e4b09a12d8f42b69",
                          doctorId: "6512c5f3e4b09a12d8f42b70",
                          diagnosis: "Skin infection due to allergy",
                          treatment:
                            "Antibiotic injection and medicated shampoo",
                          prescription: "Amoxicillin 250mg, Antihistamines",
                          visitDate: "2024-02-10",
                          createdAt: "2024-02-10T12:00:00Z",
                          updatedAt: "2024-02-11T15:30:00Z",
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
      "/v1/doctor/followups/delete/{id}": {
        post: {
          summary: "Delete a follow-up record",
          tags: ["doctor/followups"],
          security: [{ doctorBearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "ID of the follow-up record to be deleted",
            },
          ],
          responses: {
            200: {
              description: "Follow-up record deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "integer",
                        format: "int64",
                        description: "Status code",
                      },
                      message: {
                        type: "string",
                        description:
                          "Message describing the result of the operation",
                      },
                      data: {
                        type: "string",
                        description: "The response data",
                      },
                      toastMessage: {
                        type: "string",
                        description: "The toast message",
                      },
                    },
                  },
                  example: {
                    status: 200,
                    message: "Success",
                    data: "Follow-up record deleted successfully",
                    toastMessage: "Follow-up successfully deleted",
                  },
                },
              },
            },
            404: {
              description: "Follow-up record not found or already deleted",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      error: { type: "string" },
                    },
                  },
                  example: {
                    status: 404,
                    message: "error",
                    error: "Follow-up record not found or already deleted",
                  },
                },
              },
            },
          },
        },
      },
      "/v1/doctor/followups/getall": {
        post: {
          tags: ["doctor/followups"],
          summary: "Get all follow-ups",
          security: [{ doctorBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    projection: {
                      type: "object",
                      description: "Fields to include in the response",
                    },
                    filter: {
                      type: "object",
                      description:
                        "Filters to apply when retrieving follow-ups",
                    },
                    options: {
                      type: "object",
                      description: "Options for pagination and sorting",
                    },
                    pagination: {
                      type: "object",
                      description: "Pagination settings",
                    },
                    search: {
                      type: "array",
                      description: "Search settings for the request",
                      items: { type: "object" },
                    },
                    date: {
                      type: "number",
                      format: "date-time",
                      description: "Specific date filter",
                    },
                    fromDate: {
                      type: "number",
                      format: "date-time",
                      description: "Starting date filter",
                    },
                    toDate: {
                      type: "number",
                      format: "date-time",
                      description: "Ending date filter",
                    },
                  },
                },
                examples: {
                  projection: {
                    summary: "Projection Example",
                    value: { projection: { petId: 1, doctorId: 1 } },
                  },
                  date: {
                    summary: "Using Single Date Filter",
                    value: { date: 1738758000 },
                  },
                  dateRange: {
                    summary: "Using Date Range Filter (Epoch Time)",
                    value: { fromDate: 1738368000, toDate: 1739222399 },
                  },
                  pagination: {
                    summary: "Pagination Example",
                    value: { options: { page: 1, itemsPerPage: 10 } },
                  },
                  sortExample: {
                    summary: "Sort Example",
                    value: {
                      options: { sortBy: ["visitDate"], sortDesc: [true] },
                    },
                  },
                  filterExample: {
                    summary: "filter example",
                    value: { filter: { name: "rammy" } },
                  },
                  searchExample: {
                    summary: "Search Example",
                    value: {
                      search: [
                        {
                          term: "Obesity",
                          fields: ["diagnosis"],
                          startsWith: true,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get all follow-ups.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "integer",
                        format: "int64",
                        description: "Status code",
                        example: 200,
                      },
                      message: {
                        type: "string",
                        description: "Response message",
                        example: "Success",
                      },
                      data: {
                        type: "object",
                        properties: {
                          totalCount: {
                            type: "integer",
                            description: "Total number of follow-ups",
                          },
                          tableData: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                _id: {
                                  type: "string",
                                  description: "Unique follow-up ID",
                                },
                                petId: {
                                  type: "string",
                                  description: "Pet ID",
                                },
                                doctorId: {
                                  type: "string",
                                  description: "Doctor ID",
                                },
                                diagnosis: {
                                  type: "string",
                                  description: "Diagnosis details",
                                },
                                treatment: {
                                  type: "string",
                                  description: "Treatment details",
                                },
                                prescription: {
                                  type: "string",
                                  description: "Prescription given",
                                },
                                visitDate: {
                                  type: "string",
                                  format: "date-time",
                                  description: "Visit date timestamp",
                                },
                                createdAt: {
                                  type: "string",
                                  format: "date-time",
                                  description: "Follow-up creation timestamp",
                                },
                                updatedAt: {
                                  type: "string",
                                  format: "date-time",
                                  description: "Last updated timestamp",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    example1: {
                      summary: "Successful response with follow-up data",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          totalCount: 2,
                          tableData: [
                            {
                              _id: "66b3279c39c21f7342c125b4",
                              petId: "66b3279c39c21f7342c125b4",
                              doctorId: "66b3279c39c21f7342c152c5",
                              diagnosis: "Flu",
                              treatment: "Rest and fluids",
                              prescription: "Vitamin C supplements",
                              visitDate: "2025-02-05T07:00:00Z",
                              createdAt: "2025-02-05T07:30:00Z",
                              updatedAt: "2025-02-06T08:00:00Z",
                            },
                            {
                              _id: "66b3279c39c21f7342c152c5",
                              petId: "65a3279c39c21f7342c125b4",
                              doctorId: "65b437ac48d21e8343d256c7",
                              diagnosis: "Skin Infection",
                              treatment: "Antibiotic cream",
                              prescription: "Apply twice daily",
                              visitDate: "2025-02-06T10:15:00Z",
                              createdAt: "2025-02-06T11:00:00Z",
                              updatedAt: "2025-02-06T12:30:00Z",
                            },
                          ],
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
      "/v1/doctor/patients/getOne/{id}": {
        post: {
          summary: "Get one patient",
          tags: ["doctor/patients"],
          security: [{ doctorBearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description:
                "The unique identifier of the follow-up record to retrieve",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    project: {
                      type: "object",
                      description:
                        "Fields to include or exclude in the response",
                    },
                  },
                },
                examples: {
                  projectionExample: {
                    summary: "Example with projection",
                    value: {
                      projection: {
                        _id: 1,
                        name: 1,
                        species: 1,
                        breed: 1,
                        age: 1,
                        weight: 1,
                        gender: 1,
                        medicalHistory: 1,
                        bloodGroup: 1,
                        bmi: 1,
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get one follow-up record.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            format: "objectId",
                            description: "Unique identifier for the pet",
                            example: "507f1f77bcf86cd799439011",
                          },
                          name: {
                            type: "string",
                            description: "Name of the pet",
                            example: "Buddy",
                          },
                          species: {
                            type: "string",
                            description: "Species of the pet",
                            example: "Dog",
                          },
                          breed: {
                            type: "string",
                            description: "Breed of the pet",
                            example: "Golden Retriever",
                          },
                          dob: {
                            type: "string",
                            format: "date",
                            description: "Date of birth of the patient",
                            example: "1990-05-15",
                          },
                          weight: {
                            type: "number",
                            description: "Weight of the pet in kilograms",
                            example: 25.5,
                          },
                          gender: {
                            type: "string",
                            enum: ["MALE", "FEMALE"],
                            description: "Gender of the pet",
                            example: "MALE",
                          },
                          medicalHistory: {
                            type: "string",
                            description: "Medical history of the pet",
                            example: "Vaccinated, No major illnesses",
                          },
                          BMI: {
                            type: "number",
                            description: "Body Mass Index of the pet",
                            example: 18.2,
                          },
                          bloodGroup: {
                            type: "string",
                            enum: [
                              "DEA 1.1+",
                              "DEA 1.1-",
                              "DEA 1.2+",
                              "DEA 1.2-",
                              "DEA 3",
                              "DEA 4",
                              "DEA 5",
                              "DEA 7",
                              "A",
                              "B",
                              "AB",
                            ],
                            description: "Blood group of the pet",
                            example: "DEA 1.1+",
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the pet record was created",
                            example: "2024-02-19T12:34:56Z",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the pet record was last updated",
                            example: "2024-02-20T15:45:30Z",
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    "get-one-followup": {
                      summary: "Successful response",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          _id: "6512c5f3e4b09a12d8f42b68",
                          name: "Buddy",
                          species: "Dog",
                          breed: "Golden Retriever",
                          DOB: "1990-05-15",
                          weight: 25.5,
                          gender: "MALE",
                          medicalHistory: "Vaccinated, No major illnesses",
                          BMI: 18.2,
                          bloodGroup: "DEA 1.1+",
                          createdAt: "2024-02-19T12:34:56Z",
                          updatedAt: "2024-02-20T15:45:30Z",
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
      "/v1/doctor/patients/getall": {
        post: {
          tags: ["doctor/patients"],
          summary: "Get all patients",
          security: [{ doctorBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    projection: {
                      type: "object",
                      description: "Fields to include in the response",
                    },
                    filter: {
                      type: "object",
                      description:
                        "Filters to apply when retrieving follow-ups",
                    },
                    options: {
                      type: "object",
                      description: "Options for pagination and sorting",
                    },
                    pagination: {
                      type: "object",
                      description: "Pagination settings",
                    },
                    search: {
                      type: "array",
                      description: "Search settings for the request",
                      items: { type: "object" },
                    },
                    date: {
                      type: "number",
                      format: "date-time",
                      description: "Specific date filter",
                    },
                    fromDate: {
                      type: "number",
                      format: "date-time",
                      description: "Starting date filter",
                    },
                    toDate: {
                      type: "number",
                      format: "date-time",
                      description: "Ending date filter",
                    },
                  },
                },
                examples: {
                  projection: {
                    summary: "Projection Example",
                    value: { projection: { name: 1, species: 1 } },
                  },
                  date: {
                    summary: "Using Single Date Filter",
                    value: { date: 1738758000 },
                  },
                  dateRange: {
                    summary: "Using Date Range Filter (Epoch Time)",
                    value: { fromDate: 1738368000, toDate: 1739222399 },
                  },
                  pagination: {
                    summary: "Pagination Example",
                    value: { options: { page: 1, itemsPerPage: 10 } },
                  },
                  sortExample: {
                    summary: "Sort Example",
                    value: { options: { sortBy: ["date"], sortDesc: [true] } },
                  },
                  searchExample: {
                    summary: "Search Example",
                    value: {
                      search: [
                        {
                          term: "FEMALE",
                          fields: ["gender"],
                          startsWith: true,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get all follow-ups.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "integer",
                        format: "int64",
                        description: "Status code",
                        example: 200,
                      },
                      message: {
                        type: "string",
                        description: "Response message",
                        example: "Success",
                      },
                      data: {
                        type: "object",
                        properties: {
                          totalCount: {
                            type: "integer",
                            description: "Total number of follow-ups",
                          },
                          tableData: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                _id: {
                                  type: "string",
                                  format: "ObjectId",
                                  description:
                                    "Unique ID of the follow-up record",
                                },
                                name: {
                                  type: "string",
                                  description: "Name of the pet",
                                  example: "Buddy",
                                },
                                species: {
                                  type: "string",
                                  description: "Species of the pet",
                                  example: "Dog",
                                },
                                breed: {
                                  type: "string",
                                  description: "Breed of the pet",
                                  example: "Golden Retriever",
                                },
                                dob: {
                                  type: "string",
                                  format: "date",
                                  description: "Date of birth of the patient",
                                  example: "1990-05-15",
                                },
                                weight: {
                                  type: "number",
                                  description: "Weight of the pet in kilograms",
                                  example: 25.5,
                                },
                                gender: {
                                  type: "string",
                                  enum: ["MALE", "FEMALE"],
                                  description: "Gender of the pet",
                                  example: "MALE",
                                },
                                medicalHistory: {
                                  type: "string",
                                  description: "Medical history of the pet",
                                  example: "Vaccinated, No major illnesses",
                                },
                                BMI: {
                                  type: "number",
                                  description: "Body Mass Index of the pet",
                                  example: 18.2,
                                },
                                bloodGroup: {
                                  type: "string",
                                  enum: [
                                    "DEA 1.1+",
                                    "DEA 1.1-",
                                    "DEA 1.2+",
                                    "DEA 1.2-",
                                    "DEA 3",
                                    "DEA 4",
                                    "DEA 5",
                                    "DEA 7",
                                    "A",
                                    "B",
                                    "AB",
                                  ],
                                  description: "Blood group of the pet",
                                  example: "DEA 1.1+",
                                },
                                createdAt: {
                                  type: "string",
                                  format: "date-time",
                                  description:
                                    "Timestamp when the pet record was created",
                                  example: "2024-02-19T12:34:56Z",
                                },
                                updatedAt: {
                                  type: "string",
                                  format: "date-time",
                                  description:
                                    "Timestamp when the pet record was last updated",
                                  example: "2024-02-20T15:45:30Z",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    example1: {
                      summary: "Successful response with follow-up data",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          totalCount: 2,
                          tableData: [
                            {
                              _id: "66b3279c39c21f7342c125b4",
                              name: "Buddy",
                              species: "Dog",
                              breed: "Golden Retriever",
                              dob: "1990-05-15",
                              weight: 25.5,
                              gender: "MALE",
                              medicalHistory: "Vaccinated, No major illnesses",
                              BMI: 18.2,
                              bloodGroup: "DEA 1.1+",
                              createdAt: "2024-02-19T12:34:56Z",
                              updatedAt: "2024-02-20T15:45:30Z",
                            },
                            {
                              _id: "65f1c4a58e4c3d1a8b9f2c72",
                              name: "Buddy",
                              species: "Cat",
                              breed: "Golden Retriever",
                              dob: "1990-05-15",
                              weight: 25.5,
                              gender: "MALE",
                              medicalHistory: "Vaccinated, No major illnesses",
                              BMI: 18.2,
                              bloodGroup: "DEA 1.1+",
                              createdAt: "2024-02-19T12:34:56Z",
                              updatedAt: "2024-02-20T15:45:30Z",
                            },
                          ],
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
      "/v1/doctor/patients/update/{id}": {
        post: {
          tags: ["doctor/patients"],
          summary: "Update an patient record",
          security: [{ doctorBearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "The unique identifier of the patient to retrieve",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: null,
                  properties: {
                    weight: {
                      type: "number",
                      description: "Weight of the pet in kilograms",
                      example: 25.5,
                    },
                    bmi: {
                      type: "number",
                      description: "Body Mass Index of the pet",
                      example: 18.2,
                    },
                    medicalHistory: {
                      type: "array",
                      items: { type: "string" },
                      description: "Medical history of the pet",
                      example: ["Vaccinated", "No major illnesses"],
                    },
                  },
                },
                examples: {
                  updateAppointment: {
                    summary: "Example request body for updating an appointment",
                    value: {
                      weight: 25.5,
                      bmi: 18.2,
                      medicalHistory: ["Vaccinated", "No major illnesses"],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Appointment record created/updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "integer",
                        format: "int64",
                        description: "Status code",
                      },
                      message: {
                        type: "string",
                        description:
                          "Message describing the result of the operation",
                      },
                      data: {
                        type: "object",
                        description:
                          "The created or updated appointment record",
                      },
                      toastMessage: {
                        type: "string",
                        description: "The message that is sent",
                      },
                    },
                  },
                  examples: {
                    updateExample: {
                      summary:
                        "Successful response for updating an appointment",
                      value: {
                        status: 200,
                        message: "Success",
                        data: "Appointment record updated successfully",
                        toastMessage: "Appointment record updated successfully",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/nurse/appointments/create": {
        post: {
          tags: ["nurse/appointments"],
          summary: "Create or update an appointment",
          description:
            "Allows nurses to create or update appointments. The request should include an epoch timestamp for the date, and the response will return the date in ISO format.",
          security: [{ nurseBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    _id: {
                      type: "string",
                      description:
                        "The ID of the appointment (required for update)",
                    },
                    patientId: {
                      type: "string",
                      description:
                        "The ID of the patient for the appointment (required for create)",
                    },
                    doctorId: {
                      type: "string",
                      description:
                        "The ID of the doctor assigned to the appointment",
                    },
                    date: {
                      type: "integer",
                      format: "int64",
                      description:
                        "Epoch timestamp (milliseconds) for the scheduled appointment",
                    },
                    status: {
                      type: "string",
                      enum: [
                        "PENDING",
                        "COMPLETED",
                        "NOT-ATTENDED",
                        "CANCELLED",
                      ],
                      description:
                        "Status of the appointment (required for update, not needed in creation)",
                    },
                  },
                },
                examples: {
                  ExampleCreate: {
                    summary: "Create an appointment",
                    value: {
                      patientId: "67b6c3b098c669e6c66adef9",
                      doctorId: "67b6c0afb1fd18bba95f928a",
                      date: 1745990400000,
                    },
                  },
                  ExampleUpdate: {
                    summary: "Update an appointment",
                    value: {
                      _id: "67c19180b2e8bfba6a12a561",
                      doctorId: "67bc28582dc692c7133ad092",
                      date: 1745990400000,
                      status: "completed",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Appointment updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", description: "Status code" },
                      message: {
                        type: "string",
                        description: "Success message",
                      },
                      appointmentId: {
                        type: "string",
                        description: "The ID of the updated appointment",
                      },
                      data: {
                        type: "object",
                        properties: {
                          date: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Scheduled appointment date in ISO 8601 format",
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "Timestamp when the item was created",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the item was last updated",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            201: {
              description: "Appointment created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", description: "Status code" },
                      message: {
                        type: "string",
                        description: "Success message",
                      },
                      appointmentId: {
                        type: "string",
                        description: "The ID of the newly created appointment",
                      },
                      data: {
                        type: "object",
                        properties: {
                          date: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Scheduled appointment date in ISO 8601 format",
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "Timestamp when the item was created",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the item was last updated",
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
      },
      "/v1/nurse/appointments/getAll": {
        post: {
          tags: ["nurse/appointments"],
          security: [{ nurseBearerAuth: [] }],
          summary: "Get all appointments",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    projection: {
                      type: "object",
                      description: "Fields to include in the response",
                      example: {
                        _id: 1,
                        patientId: 1,
                        doctorId: 1,
                        date: 1,
                        status: 1,
                      },
                    },
                    filter: {
                      type: "object",
                      description:
                        "Filters to apply when retrieving appointments",
                    },
                    options: {
                      type: "object",
                      properties: {
                        page: {
                          type: "integer",
                          description: "Page number for pagination",
                        },
                        itemsPerPage: {
                          type: "integer",
                          description: "Number of items per page",
                        },
                        sortBy: {
                          type: "array",
                          items: { type: "string" },
                          description: "Fields to sort by",
                        },
                        sortDesc: {
                          type: "array",
                          items: { type: "boolean" },
                          description:
                            "Sort order (true for descending, false for ascending)",
                        },
                      },
                    },
                    search: {
                      type: "object",
                      description: "Search settings for the request",
                      properties: {
                        term: {
                          type: "string",
                          description: "Search term to match",
                        },
                        fields: {
                          type: "array",
                          items: { type: "string" },
                          description: "Fields to search in",
                        },
                        startsWith: {
                          type: "boolean",
                          description:
                            "Whether to search from the start of the field",
                        },
                      },
                    },
                    date: {
                      type: "integer",
                      description:
                        "The specific date in epoch format (milliseconds)",
                    },
                    fromDate: {
                      type: "integer",
                      description:
                        "The starting date in epoch format (milliseconds)",
                    },
                    toDate: {
                      type: "integer",
                      description:
                        "The ending date in epoch format (milliseconds)",
                    },
                  },
                },
                examples: {
                  projectionExample: {
                    summary: "Projection Example",
                    value: {
                      projection: {
                        _id: 1,
                        patientId: 1,
                        doctorId: 1,
                        date: 1,
                        status: 1,
                      },
                    },
                  },
                  filterExample: {
                    summary: "Filter Example",
                    value: {
                      filter: {
                        doctorId: "67b6c0afb1fd18bba95f928a",
                        status: "pending",
                      },
                    },
                  },
                  singleDateExample: {
                    summary: "Single-date Example",
                    value: { date: 1745990400 },
                  },
                  multiDateExample: {
                    summary: "Multi-date Example",
                    value: { fromDate: 17459, toDate: 1745990400 },
                  },
                  paginationExample: {
                    summary: "Pagination Example",
                    value: { options: { page: 1, itemsPerPage: 10 } },
                  },
                  sortExample: {
                    summary: "Sort Example",
                    value: {
                      options: { sortBy: ["createdAt"], sortDesc: [true] },
                    },
                  },
                  searchExample: {
                    summary: "Search Example",
                    value: {
                      search: {
                        term: "pending",
                        fields: ["status"],
                        startsWith: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/nurse/appointments/getOne/{id}": {
        post: {
          tags: ["nurse/appointments"],
          security: [{ nurseBearerAuth: [] }],
          summary: "Get one appointment by ID",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description:
                "The unique identifier of the appointment to retrieve",
            },
          ],
          requestBody: {
            required: false,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    projection: {
                      type: "object",
                      description:
                        "Fields to include or exclude in the response",
                    },
                  },
                },
                examples: {
                  projectionExample: {
                    summary: "Example with projection",
                    value: {
                      projection: {
                        _id: 1,
                        patientId: 1,
                        doctorId: 1,
                        date: 1,
                        status: 1,
                        createdAt: 1,
                        updatedAt: 1,
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Successfully retrieved appointment details.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            description: "The unique ID of the appointment",
                          },
                          patientId: {
                            type: "string",
                            description:
                              "The ID of the patient associated with the appointment",
                          },
                          doctorId: {
                            type: "string",
                            description:
                              "The ID of the doctor assigned to the appointment",
                          },
                          date: {
                            type: "string",
                            format: "date-time",
                            description: "The date and time of the appointment",
                          },
                          status: {
                            type: "string",
                            enum: [
                              "PENDING",
                              "CANCELLED",
                              "COMPLETED",
                              "NOTATTENDED",
                            ],
                            description:
                              "The current status of the appointment",
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the appointment was created",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the appointment was last updated",
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    "get-one-appointment": {
                      summary: "Successful response",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          _id: "66b3279c39c21f7342c1520a",
                          patientId: "66b3279c39c21f7342c1520p",
                          doctorId: "66b3279c39c21f7342c1520d",
                          date: "2025-02-19T10:00:00Z",
                          status: "pending",
                          createdAt: "2025-02-01T08:00:00Z",
                          updatedAt: "2025-02-01T08:00:00Z",
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
      "/v1/nurse/appointments/delete/{id}": {
        delete: {
          tags: ["nurse/appointments"],
          summary: "Delete an appointment",
          security: [{ nurseBearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "The unique identifier of the appointment to delete",
            },
          ],
          responses: {
            200: {
              description: "Appointment deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "integer",
                        format: "int64",
                        description: "Status code",
                      },
                      message: {
                        type: "string",
                        description:
                          "Message describing the result of the operation",
                      },
                      data: {
                        type: "string",
                        description: "The data that is sent",
                      },
                      toastMessage: {
                        type: "string",
                        description: "The message that is sent",
                      },
                    },
                  },
                  examples: {
                    delete: {
                      summary: "Successful",
                      value: {
                        status: 200,
                        message: "Success",
                        data: "Appointment deleted successfully",
                        toastMessage: "Appointment deleted successfully",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/nurse/auth/login": {
        post: {
          summary: "login",
          tags: ["nurse/auth"],
          security: [{ nurseBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", example: "nurse@example.com" },
                    password: { type: "string", example: "Nurse@123" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: { type: "string", example: "Success" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            example: "67bbfed74cea23da08bb62a9",
                          },
                          name: { type: "string", example: "Jane" },
                          email: {
                            type: "string",
                            example: "nurse@example.com",
                          },
                          role: { type: "string", example: "NURSE" },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-02-06T15:30:00Z",
                          },
                          access_token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                          },
                          refresh_token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                          },
                          tokenExpiresAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-07-15T12:57:10.956Z",
                          },
                        },
                      },
                      toastMessage: {
                        type: "string",
                        example: "Login successful",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/nurse/auth/logout": {
        post: {
          summary: "logout",
          tags: ["nurse/auth"],
          security: [{ nurseBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    refresh_token: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Logout successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: { type: "string", example: "Success" },
                      data: {
                        type: "string",
                        example: "Nurse logged out successfully",
                      },
                      toastMessage: {
                        type: "string",
                        example: "Nurse logged out successfully",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/nurse/auth/profile": {
        post: {
          summary: "Get user profile",
          tags: ["nurse/auth"],
          security: [{ nurseBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    project: {
                      type: "object",
                      description: "Projection fields (optional)",
                      properties: {
                        _id: { type: "integer", example: 1 },
                        name: { type: "integer", example: 1 },
                        email: { type: "integer", example: 1 },
                        role: { type: "integer", example: 1 },
                        isVerified: { type: "integer", example: 1 },
                        createdAt: { type: "integer", example: 1 },
                        updatedAt: { type: "integer", example: 1 },
                        access_token: { type: "integer", example: 1 },
                        refresh_token: { type: "integer", example: 1 },
                        tokenExpiresAt: { type: "integer", example: 1 },
                      },
                    },
                  },
                },
                examples: {
                  fullProjection: {
                    summary: "Full data projection (Retrieve all fields)",
                    value: {
                      project: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        role: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        access_token: 1,
                        refresh_token: 1,
                        tokenExpiresAt: 1,
                      },
                    },
                  },
                  limitedProjection: {
                    summary:
                      "Limited data projection (Retrieve only _id and createdAt)",
                    value: { project: { _id: 1, createdAt: 1 } },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "User profile retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: { type: "string", example: "Success" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            example: "67bbfed74cea23da08bb62a9",
                          },
                          name: { type: "string", example: "Nurse User" },
                          email: {
                            type: "string",
                            example: "nurse@example.com",
                          },
                          role: { type: "string", example: "NURSE" },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-02-05T12:00:00Z",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-02-06T15:30:00Z",
                          },
                          access_token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                          },
                          refresh_token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                          },
                          tokenExpiresAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-02-07T18:00:00Z",
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    fullResponse: {
                      summary: "Full response (all fields)",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          _id: "67bbfed74cea23da08bb62a9",
                          name: "Nurse User",
                          email: "nurse@example.com",
                          role: "NURSE",
                          createdAt: "2024-02-05T12:00:00Z",
                          updatedAt: "2024-02-06T15:30:00Z",
                          access_token:
                            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                          refresh_token:
                            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                          tokenExpiresAt: "2024-02-07T18:00:00Z",
                        },
                      },
                    },
                    limitedResponse: {
                      summary: "Limited response (only _id and createdAt)",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          _id: "6512c5f3e4b09a12d8f42b68",
                          createdAt: "2024-02-05T12:00:00Z",
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
      "/v1/nurse/auth/update": {
        put: {
          summary: "Update user profile",
          tags: ["nurse/auth"],
          security: [{ nurseBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "Jane" },
                    email: { type: "string", example: "nurse@example.com" },
                    role: {
                      type: "string",
                      enum: ["ADMIN", "DOCTOR", "RECEPTIONIST", "NURSE"],
                      example: "NURSE",
                    },
                  },
                  required: ["name", "email", "role"],
                },
                examples: {
                  fullUpdate: {
                    summary: "Full profile update",
                    value: {
                      name: "Jane",
                      email: "nurse@example.com",
                      role: "NURSE",
                    },
                  },
                  partialUpdate: {
                    summary: "Update only isDeleted status",
                    value: { id: "67bbfed74cea23da08bb62a9" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "User profile updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: { type: "string", example: "Success" },
                      data: { type: "string", example: "Updated successfully" },
                      toastMessage: {
                        type: "string",
                        example: "Updated successfully",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/nurse/patients/getAll": {
        post: {
          tags: ["nurse/patients"],
          security: [{ nurseBearerAuth: [] }],
          summary: "Get all patients",
          description:
            "Retrieves a list of patients with optional filters, search, and pagination.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    projection: {
                      type: "object",
                      description:
                        "Fields to include in the response (projection)",
                    },
                    filter: {
                      type: "object",
                      description: "Filters to apply when retrieving patients",
                    },
                    options: {
                      type: "object",
                      description: "Options for pagination and sorting",
                    },
                    pagination: {
                      type: "object",
                      description: "Pagination settings for the response",
                    },
                    search: {
                      type: "array",
                      description: "Search settings for the request",
                      items: { type: "object" },
                    },
                    date: {
                      type: "integer",
                      format: "int64",
                      description: "The specific date in epoch format",
                    },
                    fromDate: {
                      type: "integer",
                      format: "int64",
                      description: "The specific date in epoch format",
                    },
                    toDate: {
                      type: "integer",
                      format: "int64",
                      description: "The specific date in epoch format",
                    },
                  },
                },
                examples: {
                  projectionExample: {
                    summary: "Projection Example",
                    value: {
                      projection: {
                        _id: 1,
                        name: 1,
                        species: 1,
                        breed: 1,
                        age: 1,
                        weight: 1,
                        gender: 1,
                        medicalHistory: 1,
                        bmi: 1,
                        bloodGroup: 1,
                      },
                    },
                  },
                  filterExample: {
                    summary: "Filter Example",
                    value: { filter: { name: "Rammy" } },
                  },
                  singleDateExample: {
                    summary: "Single Date Example",
                    value: { date: 17459904000 },
                  },
                  multiDateExample: {
                    summary: "Multi-Date Example",
                    value: { fromDate: 1745990400000, toDate: 17459904000 },
                  },
                  paginationExample: {
                    summary: "Pagination Example",
                    value: { options: { page: 1, itemsPerPage: 10 } },
                  },
                  sortExample: {
                    summary: "Sort Example",
                    value: {
                      options: { sortBy: ["createdAt"], sortDesc: [true] },
                    },
                  },
                  searchExample: {
                    summary: "Search Example",
                    value: {
                      search: [
                        {
                          term: "Golden Retriever",
                          fields: ["breed"],
                          startsWith: true,
                          endsWith: false,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Successfully retrieved patients.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          totalCount: {
                            type: "integer",
                            description: "Total number of patients",
                          },
                          tableData: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                _id: {
                                  type: "string",
                                  description: "The unique ID of the patient",
                                },
                                name: {
                                  type: "string",
                                  description: "The name of the patient",
                                },
                                species: {
                                  type: "string",
                                  description: "The species of the patient",
                                },
                                breed: {
                                  type: "string",
                                  description: "The breed of the patient",
                                },
                                age: {
                                  type: "integer",
                                  description: "The age of the patient",
                                },
                                weight: {
                                  type: "number",
                                  format: "float",
                                  description: "The weight of the patient",
                                },
                                gender: {
                                  type: "string",
                                  enum: ["MALE", "FEMALE"],
                                  description: "The gender of the patient",
                                },
                                medicalHistory: {
                                  type: "string",
                                  description:
                                    "The medical history of the patient",
                                },
                                bmi: {
                                  type: "number",
                                  format: "float",
                                  description: "The BMI of the patient",
                                },
                                bloodGroup: {
                                  type: "string",
                                  enum: [
                                    "DEA 1.1+",
                                    "DEA 1.1-",
                                    "DEA 1.2+",
                                    "DEA 1.2-",
                                    "DEA 3",
                                    "DEA 4",
                                    "DEA 5",
                                    "DEA 7",
                                    "A",
                                    "B",
                                    "AB",
                                  ],
                                  description: "The blood group of the patient",
                                },
                                createdAt: {
                                  type: "string",
                                  format: "date-time",
                                  description:
                                    "Timestamp when the patient record was created",
                                },
                                updatedAt: {
                                  type: "string",
                                  format: "date-time",
                                  description:
                                    "Timestamp when the patient record was last updated",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    successExample: {
                      summary: "Successful Response",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          totalCount: 2,
                          tableData: [
                            {
                              _id: "66b3279c39c21f7342c125b4",
                              name: "Buddy",
                              species: "Dog",
                              breed: "Golden Retriever",
                              age: 5,
                              weight: 30.5,
                              gender: "MALE",
                              medicalHistory: "No known issues",
                              bmi: 24.7,
                              bloodGroup: "DEA 1.1+",
                              createdAt: "2025-02-01T08:00:00Z",
                              updatedAt: "2025-02-01T08:00:00Z",
                            },
                            {
                              _id: "66b3279c39c21f7342c1520n",
                              name: "Mittens",
                              species: "Cat",
                              breed: "Persian",
                              age: 3,
                              weight: 4.8,
                              gender: "FEMALE",
                              medicalHistory: "Allergic to certain foods",
                              bmi: 22.1,
                              bloodGroup: "A",
                              createdAt: "2025-02-01T08:00:00Z",
                              updatedAt: "2025-02-01T08:00:00Z",
                            },
                          ],
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
      "/v1/nurse/patients/getOne/{id}": {
        post: {
          tags: ["nurse/patients"],
          security: [{ nurseBearerAuth: [] }],
          summary: "Get one",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "The unique identifier of the patient to retrieve",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    project: {
                      type: "object",
                      description:
                        "Fields to include or exclude in the response",
                    },
                  },
                },
                examples: {
                  projectionExample: {
                    summary: "Example with projection",
                    value: { projection: { _id: 1, name: 1 } },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get one patient.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            description: "The unique ID of the patient",
                          },
                          name: {
                            type: "string",
                            description: "The name of the patient",
                          },
                          species: {
                            type: "string",
                            description: "The species of the patient",
                          },
                          breed: {
                            type: "string",
                            description: "The breed of the patient",
                          },
                          age: {
                            type: "integer",
                            description: "The age of the patient",
                          },
                          weight: {
                            type: "number",
                            format: "float",
                            description: "The weight of the patient",
                          },
                          gender: {
                            type: "string",
                            enum: ["MALE", "FEMALE"],
                            description: "The gender of the patient",
                          },
                          medicalHistory: {
                            type: "array",
                            items: { type: "string" },
                            description: "The medical history of the patient",
                          },
                          BMI: {
                            type: "number",
                            format: "float",
                            description: "The BMI of the patient",
                          },
                          bloodGroup: {
                            type: "string",
                            enum: [
                              "DEA 1.1+",
                              "DEA 1.1-",
                              "DEA 1.2+",
                              "DEA 1.2-",
                              "DEA 3",
                              "DEA 4",
                              "DEA 5",
                              "DEA 7",
                              "A",
                              "B",
                              "AB",
                            ],
                            description: "The blood group of the patient",
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the patient record was created",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the patient record was last updated",
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    "get-one-patient": {
                      summary: "Successful response",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          _id: "66b3279c39c21f7342c1520p",
                          name: "Buddy",
                          species: "Dog",
                          breed: "Labrador Retriever",
                          age: 5,
                          weight: 30.5,
                          gender: "MALE",
                          medicalHistory: "Vaccinated, No known allergies",
                          BMI: 23.4,
                          bloodGroup: "DEA 1.1+",
                          createdAt: "2025-02-01T08:00:00Z",
                          updatedAt: "2025-02-01T08:00:00Z",
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
      "/v1/receptionist/appointments/create": {
        post: {
          tags: ["receptionist/appointments"],
          summary: "Create/Update an appointment record",
          security: [{ adminBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["patientId", "doctorId", "date"],
                  properties: {
                    _id: {
                      type: "string",
                      description:
                        "The unique ID of the appointment (for updates)",
                    },
                    patientId: {
                      type: "string",
                      description: "The ID of the pet for the appointment",
                    },
                    doctorId: {
                      type: "string",
                      description:
                        "The ID of the doctor assigned to the appointment",
                    },
                    date: {
                      type: "string",
                      format: "date-time",
                      description:
                        "The scheduled date and time of the appointment",
                    },
                    schedule: {
                      type: "string",
                      enum: ["SCHEDULED", "COMPLETED", "CANCELLED"],
                      description: "Status of the appointment",
                    },
                    isDeleted: {
                      type: "boolean",
                      description: "Whether the appointment record is deleted",
                    },
                  },
                },
                examples: {
                  createAppointment: {
                    summary: "Example request body for creating an appointment",
                    value: {
                      patientId: "66b3279c39c21f7342c100c4",
                      doctorId: "66b3279c39c21f7342c100c5",
                      date: "27-02-2025",
                    },
                  },
                  updateAppointment: {
                    summary: "Example request body for updating an appointment",
                    value: {
                      _id: "66b3279c39c21f7342c100c6",
                      patientId: "66b3279c39c21f7342c100c4",
                      doctorId: "66b3279c39c21f7342c100c5",
                      date: "2025-03-05T14:00:00.000Z",
                      schedule: "COMPLETED",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Appointment record created/updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "integer",
                        format: "int64",
                        description: "Status code",
                      },
                      message: {
                        type: "string",
                        description:
                          "Message describing the result of the operation",
                      },
                      data: {
                        type: "object",
                        description:
                          "The created or updated appointment record",
                      },
                      toastMessage: {
                        type: "string",
                        description: "The message that is sent",
                      },
                    },
                  },
                  examples: {
                    createExample: {
                      summary:
                        "Successful response for creating an appointment",
                      value: {
                        status: 200,
                        message: "Success",
                        data: "Appointment added successfully",
                        toastMessage: "Appointment added successfully",
                      },
                    },
                    updateExample: {
                      summary:
                        "Successful response for updating an appointment",
                      value: {
                        status: 200,
                        message: "Success",
                        data: "Appointment record updated successfully",
                        toastMessage: "Appointment record updated successfully",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/receptionist/appointments/getAll": {
        post: {
          tags: ["receptionist/appointments"],
          security: [{ adminBearerAuth: [] }],
          summary: "Get all",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    projection: {
                      type: "object",
                      description:
                        "Fields to include in the response (projection)",
                    },
                    filter: {
                      type: "object",
                      description:
                        "Filters to apply when retrieving appointments",
                    },
                    options: {
                      type: "object",
                      description: "Options for pagination and sorting",
                    },
                    pagination: {
                      type: "object",
                      description: "Pagination settings for the response",
                    },
                    search: {
                      type: "array",
                      description: "Search settings for the request",
                      items: { type: "object" },
                    },
                    date: {
                      type: "integer",
                      description: "The specific date in Unix timestamp format",
                    },
                    fromDate: {
                      type: "integer",
                      description: "The starting date in Unix timestamp format",
                    },
                    toDate: {
                      type: "integer",
                      description: "The ending date in Unix timestamp format",
                    },
                  },
                },
                examples: {
                  projectionExample: {
                    summary: "Projection Example",
                    value: {
                      projection: {
                        _id: 1,
                        petId: 1,
                        doctorId: 1,
                        date: 1,
                        schedule: 1,
                        createdAt: 1,
                        updatedAt: 1,
                      },
                    },
                  },
                  filterExample: {
                    summary: "Filter Example",
                    value: {
                      filter: {
                        doctorId: "66b3279c39c21f7342c13333",
                        schedule: "SCHEDULED",
                        petId: {
                          $in: [
                            "66b3279c39c21f7342c12222",
                            "66b3279c39c21f7342c14444",
                          ],
                        },
                      },
                    },
                  },
                  singleDateExample: {
                    summary: "Multi-date Example",
                    value: { date: 1738658701 },
                  },
                  multiDateExample: {
                    summary: "Single-date Example",
                    value: { fromDate: 1707036301, toDate: 1738658701 },
                  },
                  pagination: {
                    summary: "Pagination Example",
                    value: { options: { page: 1, itemsPerPage: 10 } },
                  },
                  sortExample: {
                    summary: "Sort Example",
                    value: {
                      options: { sortBy: ["createdAt"], sortDesc: [true] },
                    },
                  },
                  searchExample: {
                    summary: "Search Example",
                    value: {
                      search: [
                        {
                          term: "SCHEDULED",
                          fields: ["schedule"],
                          startsWith: true,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get all appointments.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          totalCount: {
                            type: "integer",
                            description: "Total number of appointments",
                          },
                          tableData: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                _id: {
                                  type: "string",
                                  description:
                                    "The unique ID of the appointment",
                                },
                                petId: {
                                  type: "string",
                                  description: "The ID of the pet",
                                },
                                doctorId: {
                                  type: "string",
                                  description: "The ID of the doctor",
                                },
                                date: {
                                  type: "string",
                                  format: "date-time",
                                  description:
                                    "The date and time of the appointment",
                                },
                                schedule: {
                                  type: "string",
                                  enum: ["SCHEDULED", "COMPLETED", "CANCELLED"],
                                  description:
                                    "The current status of the appointment",
                                },
                                createdAt: {
                                  type: "string",
                                  format: "date-time",
                                  description:
                                    "Timestamp when the appointment was created",
                                },
                                updatedAt: {
                                  type: "string",
                                  format: "date-time",
                                  description:
                                    "Timestamp when the appointment was last updated",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    example1: {
                      summary: "Successful response with data",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          totalCount: 2,
                          tableData: [
                            {
                              _id: "66b3279c39c21f7342c125b4",
                              petId: "66b3279c39c21f7342c12222",
                              doctorId: "66b3279c39c21f7342c13333",
                              date: "2025-02-01T08:00:00Z",
                              schedule: "SCHEDULED",
                              createdAt: "2025-02-01T08:00:00Z",
                              updatedAt: "2025-02-01T08:00:00Z",
                            },
                            {
                              _id: "66b3279c39c21f7342c1520n",
                              petId: "66b3279c39c21f7342c14444",
                              doctorId: "66b3279c39c21f7342c15555",
                              date: "2025-02-02T10:30:00Z",
                              schedule: "COMPLETED",
                              createdAt: "2025-02-02T08:00:00Z",
                              updatedAt: "2025-02-02T08:00:00Z",
                            },
                          ],
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
      "/v1/receptionist/appointments/getOne/{id}": {
        post: {
          tags: ["receptionist/appointments"],
          security: [{ adminBearerAuth: [] }],
          summary: "Get one",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description:
                "The unique identifier of the appointment to retrieve",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    project: {
                      type: "object",
                      description:
                        "Fields to include or exclude in the response",
                    },
                  },
                },
                examples: {
                  projectionExample: {
                    summary: "Example with projection",
                    value: {
                      project: {
                        _id: 1,
                        petId: 1,
                        doctorId: 1,
                        date: 1,
                        schedule: 1,
                        createdAt: 1,
                        updatedAt: 1,
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get one appointment.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            description: "The unique ID of the appointment",
                          },
                          petId: {
                            type: "string",
                            description:
                              "The ID of the pet associated with the appointment",
                          },
                          doctorId: {
                            type: "string",
                            description:
                              "The ID of the doctor assigned to the appointment",
                          },
                          date: {
                            type: "string",
                            format: "date-time",
                            description: "The date and time of the appointment",
                          },
                          schedule: {
                            type: "string",
                            enum: ["SCHEDULED", "COMPLETED", "CANCELLED"],
                            description: "The status of the appointment",
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the appointment was created",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the appointment was last updated",
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    "get-one-appointment": {
                      summary: "Successful response",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          _id: "66b3279c39c21f7342c1520a",
                          petId: "66b3279c39c21f7342c1520p",
                          doctorId: "66b3279c39c21f7342c1520d",
                          date: "2025-02-19T10:00:00Z",
                          schedule: "SCHEDULED",
                          createdAt: "2025-02-01T08:00:00Z",
                          updatedAt: "2025-02-01T08:00:00Z",
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
      "/v1/receptionist/appointments/delete/{id}": {
        delete: {
          tags: ["receptionist/appointments"],
          summary: "Delete an appointment",
          security: [{ adminBearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "The unique identifier of the appointment to delete",
            },
          ],
          responses: {
            200: {
              description: "Appointment deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "integer",
                        format: "int64",
                        description: "Status code",
                      },
                      message: {
                        type: "string",
                        description:
                          "Message describing the result of the operation",
                      },
                      data: {
                        type: "string",
                        description: "The data that is sent",
                      },
                      toastMessage: {
                        type: "string",
                        description: "The message that is sent",
                      },
                    },
                  },
                  examples: {
                    delete: {
                      summary: "Successful",
                      value: {
                        status: 200,
                        message: "Success",
                        data: "Appointment deleted successfully",
                        toastMessage: "Appointment deleted successfully",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/receptionist/auth/login": {
        post: {
          summary: "login",
          tags: ["receptionist/auth"],
          security: [{ adminBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: {
                      type: "string",
                      example: "receptionist@example.com",
                    },
                    password: { type: "string", example: "Reception@123" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: { type: "string", example: "Success" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            example: "6512c5f3e4b09a12d8f42b68",
                          },
                          name: {
                            type: "string",
                            example: "Receptionist Mike",
                          },
                          email: {
                            type: "string",
                            example: "receptionist@example.com",
                          },
                          role: { type: "string", example: "Receptionist" },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-02-06T15:30:00Z",
                          },
                          access_token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9...",
                          },
                          refresh_token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9...",
                          },
                          tokenExpiresAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-07-15T12:57:10.956Z",
                          },
                        },
                      },
                      toastMessage: {
                        type: "string",
                        example: "Login successful",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/receptionist/auth/logout": {
        post: {
          summary: "logout",
          tags: ["receptionist/auth"],
          security: [{ adminBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    refresh_token: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9...",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Logout successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: { type: "string", example: "Success" },
                      data: {
                        type: "string",
                        example: "Admin logged out successfully",
                      },
                      toastMessage: {
                        type: "string",
                        example: "Admin logged out successfully",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/receptionist/auth/profile": {
        post: {
          summary: "Get user profile",
          tags: ["receptionist/auth"],
          security: [{ adminBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    project: {
                      type: "object",
                      description: "Projection fields (optional)",
                      properties: {
                        _id: { type: "integer", example: 1 },
                        name: { type: "integer", example: 1 },
                        email: { type: "integer", example: 1 },
                        role: { type: "integer", example: 1 },
                        isVerified: { type: "integer", example: 1 },
                        createdAt: { type: "integer", example: 1 },
                        updatedAt: { type: "integer", example: 1 },
                        access_token: { type: "integer", example: 1 },
                        refresh_token: { type: "integer", example: 1 },
                        tokenExpiresAt: { type: "integer", example: 1 },
                      },
                    },
                  },
                },
                examples: {
                  fullProjection: {
                    summary: "Full data projection (Retrieve all fields)",
                    value: {
                      project: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        role: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        access_token: 1,
                        refresh_token: 1,
                        tokenExpiresAt: 1,
                      },
                    },
                  },
                  limitedProjection: {
                    summary:
                      "Limited data projection (Retrieve only _id and createdAt)",
                    value: { project: { _id: 1, createdAt: 1 } },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "User profile retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: { type: "string", example: "Success" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            example: "6512c5f3e4b09a12d8f42b68",
                          },
                          name: { type: "string", example: "Admin User" },
                          email: {
                            type: "string",
                            example: "admin@example.com",
                          },
                          role: { type: "string", example: "ADMIN" },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-02-05T12:00:00Z",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-02-06T15:30:00Z",
                          },
                          access_token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9...",
                          },
                          refresh_token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9...",
                          },
                          tokenExpiresAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-02-07T18:00:00Z",
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    fullResponse: {
                      summary: "Full response (all fields)",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          _id: "6512c5f3e4b09a12d8f42b68",
                          name: "Admin User",
                          email: "admin@example.com",
                          role: "ADMIN",
                          createdAt: "2024-02-05T12:00:00Z",
                          updatedAt: "2024-02-06T15:30:00Z",
                          access_token:
                            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9...",
                          refresh_token:
                            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9...",
                          tokenExpiresAt: "2024-02-07T18:00:00Z",
                        },
                      },
                    },
                    limitedResponse: {
                      summary: "Limited response (only _id and createdAt)",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          _id: "6512c5f3e4b09a12d8f42b68",
                          createdAt: "2024-02-05T12:00:00Z",
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
      "/v1/receptionist/auth/update": {
        put: {
          summary: "Update user profile",
          tags: ["receptionist/auth"],
          security: [{ adminBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "Receptionist Mike" },
                    email: {
                      type: "string",
                      example: "receptionist@example.com",
                    },
                    role: {
                      type: "string",
                      enum: ["ADMIN", "DOCTOR", "RECEPTIONIST", "NURSE"],
                      example: "Receptionist",
                    },
                    isDeleted: { type: "boolean", example: false },
                  },
                  required: ["name", "email", "role"],
                },
                examples: {
                  fullUpdate: {
                    summary: "Full profile update",
                    value: {
                      name: "Receptionist Mike",
                      email: "receptionist@example.com",
                      role: "Receptionist",
                      isDeleted: false,
                    },
                  },
                  partialUpdate: {
                    summary: "Update only isDeleted status",
                    value: { isDeleted: true },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "User profile updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: { type: "string", example: "Success" },
                      data: { type: "string", example: "Updated successfully" },
                      toastMessage: {
                        type: "string",
                        example: "Updated successfully",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/receptionist/auth/refresh": {
        post: {
          summary: "Refresh user token",
          tags: ["receptionist/auth"],
          security: [{ adminBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    refresh_token: {
                      type: "string",
                      example:
                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV2CJ9.eyJpYXQiOjE3MTg0NTYyMzEsImV4cCI6MjAzMzgxNjIzMX0.Po_Xc3McuJt4GhKWpd1B5cUcHsdZWq_4ElO138VmsU",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Token refreshed successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", example: 200 },
                      message: { type: "string", example: "Success" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            example: "6512c5f3e4b09a12d8f42b68",
                          },
                          name: { type: "string", example: "Admin User" },
                          email: {
                            type: "string",
                            example: "admin@example.com",
                          },
                          role: { type: "string", example: "ADMIN" },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-02-05T12:00:00Z",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-02-06T15:30:00Z",
                          },
                          access_token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV2CJ9...",
                          },
                          refresh_token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV2CJ9...",
                          },
                          tokenExpiresAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-07-15T12:57:10.956Z",
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
      },
      "/v1/receptionist/patients/createupdate": {
        post: {
          tags: ["receptionist/patients"],
          summary: "Create or update a patient record",
          description:
            "This endpoint allows the receptionist to create a new patient record or update an existing one based on the provided `_id`.",
          security: [{ adminBearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "name",
                    "species",
                    "breed",
                    "dob",
                    "weight",
                    "gender",
                    "medicalHistory",
                    "bmi",
                    "bloodGroup",
                  ],
                  properties: {
                    _id: {
                      type: "string",
                      description:
                        "The unique ID of the patient (only required for updates)",
                    },
                    name: {
                      type: "string",
                      description: "Name of the patient",
                    },
                    species: {
                      type: "string",
                      description: "Species of the patient (e.g., Dog, Cat)",
                    },
                    breed: {
                      type: "string",
                      description: "Breed of the patient",
                    },
                    dob: {
                      type: "string",
                      format: "date",
                      description: "Date of birth of the patient (YYYY-MM-DD)",
                    },
                    weight: {
                      type: "number",
                      description: "Weight of the patient in kg",
                    },
                    gender: {
                      type: "string",
                      enum: ["MALE", "FEMALE"],
                      description: "Gender of the patient",
                    },
                    medicalHistory: {
                      type: "array",
                      items: { type: "string" },
                      description: "List of past medical conditions",
                    },
                    bmi: { type: "number", description: "BMI of the patient" },
                    bloodGroup: {
                      type: "string",
                      enum: [
                        "DEA 1.1+",
                        "DEA 1.1-",
                        "DEA 1.2+",
                        "DEA 1.2-",
                        "DEA 3",
                        "DEA 4",
                        "DEA 5",
                        "DEA 7",
                        "A",
                        "B",
                        "AB",
                      ],
                      description: "Blood group of the patient",
                    },
                    isDeleted: {
                      type: "boolean",
                      description: "Whether the patient record is deleted",
                    },
                  },
                },
                examples: {
                  createPatient: {
                    summary: "Example request body for creating a patient",
                    value: {
                      name: "Buddy",
                      species: "Dog",
                      breed: "Golden Retriever",
                      dob: "2019-06-15",
                      weight: 30,
                      gender: "MALE",
                      medicalHistory: ["Vaccinated", "Hip Dysplasia"],
                      bmi: 22.5,
                      bloodGroup: "DEA 1.1+",
                    },
                  },
                  updatePatient: {
                    summary: "Example request body for updating a patient",
                    value: {
                      _id: "66b3279c39c21f7342c100c4",
                      name: "Buddy",
                      species: "Dog",
                      breed: "Golden Retriever",
                      dob: "2018-04-20",
                      weight: 32,
                      gender: "MALE",
                      medicalHistory: [
                        "Vaccinated",
                        "Hip Dysplasia",
                        "Arthritis",
                      ],
                      bmi: 23,
                      bloodGroup: "DEA 1.1+",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Patient record created/updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "integer",
                        format: "int64",
                        description: "Status code",
                      },
                      message: {
                        type: "string",
                        description:
                          "Message describing the result of the operation",
                      },
                      data: {
                        type: "object",
                        description: "The created or updated patient record",
                      },
                      toastMessage: {
                        type: "string",
                        description: "The message that is sent",
                      },
                    },
                  },
                  examples: {
                    createExample: {
                      summary: "Successful response for creating a patient",
                      value: {
                        status: 200,
                        message: "Success",
                        data: "Patient added successfully",
                        toastMessage: "Patient added successfully",
                      },
                    },
                    updateExample: {
                      summary: "Successful response for updating a patient",
                      value: {
                        status: 200,
                        message: "Success",
                        data: "Patient record updated successfully",
                        toastMessage: "Patient record updated successfully",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/receptionist/patients/getAll": {
        post: {
          tags: ["receptionist/patients"],
          security: [{ adminBearerAuth: [] }],
          summary: "Get all",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    projection: {
                      type: "object",
                      description:
                        "Fields to include in the response (projection)",
                    },
                    filter: {
                      type: "object",
                      description: "Filters to apply when retrieving patients",
                    },
                    options: {
                      type: "object",
                      description: "Options for pagination and sorting",
                    },
                    pagination: {
                      type: "object",
                      description: "Pagination settings for the response",
                    },
                    search: {
                      type: "array",
                      description: "Search settings for the request",
                      items: { type: "object" },
                    },
                    date: {
                      type: "integer",
                      description: "The specific date in Unix timestamp format",
                    },
                    fromDate: {
                      type: "integer",
                      description: "The starting date in Unix timestamp format",
                    },
                    toDate: {
                      type: "integer",
                      description: "The ending date in Unix timestamp format",
                    },
                  },
                },
                examples: {
                  projectionExample: {
                    summary: "Projection Example",
                    value: {
                      projection: {
                        _id: 1,
                        name: 1,
                        species: 1,
                        breed: 1,
                        dob: 1,
                        weight: 1,
                        gender: 1,
                        medicalHistory: 1,
                        bmi: 1,
                        bloodGroup: 1,
                      },
                    },
                  },
                  filterExample: {
                    summary: "filter example",
                    value: { filter: { name: "rammy" } },
                  },
                  singleDateExample: {
                    summary: "Multi-date Example",
                    value: { date: 1738658701 },
                  },
                  multiDateExample: {
                    summary: "Single-date Example",
                    value: { fromDate: 1707036301, toDate: 1738658701 },
                  },
                  pagination: {
                    summary: "Pagination Example",
                    value: { options: { page: 1, itemsPerPage: 10 } },
                  },
                  sortExample: {
                    summary: "Sort Example",
                    value: {
                      options: { sortBy: ["createdAt"], sortDesc: [true] },
                    },
                  },
                  searchExample: {
                    summary: "Search Example",
                    value: {
                      search: [
                        {
                          term: "Golden Retriever",
                          fields: ["breed"],
                          startsWith: true,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get all patients.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          totalCount: {
                            type: "integer",
                            description: "Total number of patients",
                          },
                          tableData: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                _id: {
                                  type: "string",
                                  description: "The unique ID of the patient",
                                },
                                name: {
                                  type: "string",
                                  description: "The name of the patient",
                                },
                                species: {
                                  type: "string",
                                  description: "The species of the patient",
                                },
                                breed: {
                                  type: "string",
                                  description: "The breed of the patient",
                                },
                                dob: {
                                  type: "string",
                                  format: "date",
                                  description: "The date of the patient",
                                },
                                weight: {
                                  type: "number",
                                  format: "float",
                                  description: "The weight of the patient",
                                },
                                gender: {
                                  type: "string",
                                  enum: ["MALE", "FEMALE"],
                                  description: "The gender of the patient",
                                },
                                medicalHistory: {
                                  type: "string",
                                  description:
                                    "The medical history of the patient",
                                },
                                bmi: {
                                  type: "number",
                                  format: "float",
                                  description: "The BMI of the patient",
                                },
                                bloodGroup: {
                                  type: "string",
                                  enum: [
                                    "DEA 1.1+",
                                    "DEA 1.1-",
                                    "DEA 1.2+",
                                    "DEA 1.2-",
                                    "DEA 3",
                                    "DEA 4",
                                    "DEA 5",
                                    "DEA 7",
                                    "A",
                                    "B",
                                    "AB",
                                  ],
                                  description: "The blood group of the patient",
                                },
                                createdAt: {
                                  type: "string",
                                  format: "date-time",
                                  description:
                                    "Timestamp when the patient record was created",
                                },
                                updatedAt: {
                                  type: "string",
                                  format: "date-time",
                                  description:
                                    "Timestamp when the patient record was last updated",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    example1: {
                      summary: "Successful response with data",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          totalCount: 2,
                          tableData: [
                            {
                              _id: "66b3279c39c21f7342c125b4",
                              name: "Buddy",
                              species: "Dog",
                              breed: "Golden Retriever",
                              dob: "2020-05-15",
                              weight: 30.5,
                              gender: "MALE",
                              medicalHistory: "No known issues",
                              bmi: 24.7,
                              bloodGroup: "DEA 1.1+",
                              createdAt: "2025-02-01T08:00:00Z",
                              updatedAt: "2025-02-01T08:00:00Z",
                            },
                            {
                              _id: "66b3279c39c21f7342c1520n",
                              name: "Mittens",
                              species: "Cat",
                              breed: "Persian",
                              dob: "2022-09-10",
                              weight: 4.8,
                              gender: "FEMALE",
                              medicalHistory: "Allergic to certain foods",
                              bmi: 22.1,
                              bloodGroup: "A",
                              createdAt: "2025-02-01T08:00:00Z",
                              updatedAt: "2025-02-01T08:00:00Z",
                            },
                          ],
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
      "/v1/receptionist/patients/getOne/{id}": {
        post: {
          tags: ["receptionist/patients"],
          security: [{ adminBearerAuth: [] }],
          summary: "Get one",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "The unique identifier of the patient to retrieve",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    project: {
                      type: "object",
                      description:
                        "Fields to include or exclude in the response",
                    },
                  },
                },
                examples: {
                  projectionExample: {
                    summary: "Example with projection",
                    value: { projection: { _id: 1, name: 1 } },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Get one patient.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "integer", format: "int64" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          _id: {
                            type: "string",
                            description: "The unique ID of the patient",
                          },
                          name: {
                            type: "string",
                            description: "The name of the patient",
                          },
                          species: {
                            type: "string",
                            description: "The species of the patient",
                          },
                          breed: {
                            type: "string",
                            description: "The breed of the patient",
                          },
                          dob: {
                            type: "string",
                            format: "date",
                            description: "The date of the patient",
                          },
                          weight: {
                            type: "number",
                            format: "float",
                            description: "The weight of the patient",
                          },
                          gender: {
                            type: "string",
                            enum: ["MALE", "FEMALE"],
                            description: "The gender of the patient",
                          },
                          medicalHistory: {
                            type: "array",
                            items: { type: "string" },
                            description: "The medical history of the patient",
                          },
                          bmi: {
                            type: "number",
                            format: "float",
                            description: "The BMI of the patient",
                          },
                          bloodGroup: {
                            type: "string",
                            enum: [
                              "DEA 1.1+",
                              "DEA 1.1-",
                              "DEA 1.2+",
                              "DEA 1.2-",
                              "DEA 3",
                              "DEA 4",
                              "DEA 5",
                              "DEA 7",
                              "A",
                              "B",
                              "AB",
                            ],
                            description: "The blood group of the patient",
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the patient record was created",
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            description:
                              "Timestamp when the patient record was last updated",
                          },
                        },
                      },
                    },
                  },
                  examples: {
                    "get-one-patient": {
                      summary: "Successful response",
                      value: {
                        status: 200,
                        message: "Success",
                        data: {
                          _id: "66b3279c39c21f7342c1520p",
                          name: "Buddy",
                          species: "Dog",
                          breed: "Labrador Retriever",
                          dob: 5,
                          weight: 30.5,
                          gender: "MALE",
                          medicalHistory: "Vaccinated, No known allergies",
                          BMI: 23.4,
                          bloodGroup: "DEA 1.1+",
                          createdAt: "2025-02-01T08:00:00Z",
                          updatedAt: "2025-02-01T08:00:00Z",
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
    },
    tags: [],
  };
  docs.apiDescriptionDocument = apiDescriptionDocument;
})();
