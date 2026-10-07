
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    

// src/app/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";

// src/modules/auth/auth.routes.ts
import { Router } from "express";

// src/middleware/validateRequest.ts
var validateRequest = (schema, source = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues
      });
    }
    if (source === "body") {
      req.body = result.data;
    } else {
      req.validatedQuery = result.data;
    }
    next();
  };
};
var validateRequest_default = validateRequest;

// src/config/index.ts
import dotenv from "dotenv";
dotenv.config();
var config = {
  port: Number(process.env.PORT) || 5e3,
  nodeEnv: process.env.NODE_ENV || "development",
  appUrl: process.env.APP_URL || "http://localhost:3000",
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
  }
};
var config_default = config;

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, {
    expiresIn
  });
};
var verifyToken = (token, secret) => {
  const decoded = jwt.verify(token, secret);
  if (typeof decoded !== "object" || decoded === null || typeof decoded.userId !== "number" || typeof decoded.role !== "string") {
    throw new Error("Invalid token payload");
  }
  return decoded;
};

// src/middleware/auth.ts
var auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "You are not authorized",
      errors: []
    });
  }
  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization format",
      errors: []
    });
  }
  try {
    const decoded = verifyToken(
      token,
      config_default.jwt.accessSecret
    );
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      errors: []
    });
  }
};
var auth_default = auth;

// src/modules/auth/auth.validation.ts
import { z } from "zod";
var registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional()
});
var loginSchema = z.object({
  email: z.string().email("Please provide a valid email"),
  password: z.string().min(1, "Password is required")
});

// src/utils/sendResponse.ts
var sendResponse = (res, options) => {
  const { statusCode, success, message, data } = options;
  return res.status(statusCode).json({
    success,
    message,
    data: data ?? null
  });
};
var sendResponse_default = sendResponse;

// src/modules/auth/auth.service.ts
import bcrypt from "bcrypt";

// src/prisma/db.ts
import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";

// src/prisma/contract.json
var contract_default = {
  schemaVersion: "1",
  targetFamily: "sql",
  target: "postgres",
  profileHash: "3916f444a8a17ad749191acf9e08dad97d1a327b88c2f1d45d12f240296aa8b2",
  roots: {
    AuditLog: {
      model: "AuditLog",
      namespace: "public"
    },
    Parcel: {
      model: "Parcel",
      namespace: "public"
    },
    ParcelTracking: {
      model: "ParcelTracking",
      namespace: "public"
    },
    Payment: {
      model: "Payment",
      namespace: "public"
    },
    User: {
      model: "User",
      namespace: "public"
    }
  },
  domain: {
    namespaces: {
      public: {
        enum: {
          ParcelStatus: {
            codecId: "pg/text@1",
            members: [
              {
                name: "PENDING",
                value: "PENDING"
              },
              {
                name: "PICKED_UP",
                value: "PICKED_UP"
              },
              {
                name: "IN_TRANSIT",
                value: "IN_TRANSIT"
              },
              {
                name: "OUT_FOR_DELIVERY",
                value: "OUT_FOR_DELIVERY"
              },
              {
                name: "DELIVERED",
                value: "DELIVERED"
              },
              {
                name: "CANCELLED",
                value: "CANCELLED"
              }
            ]
          },
          PaymentStatus: {
            codecId: "pg/text@1",
            members: [
              {
                name: "PENDING",
                value: "PENDING"
              },
              {
                name: "PAID",
                value: "PAID"
              },
              {
                name: "FAILED",
                value: "FAILED"
              },
              {
                name: "REFUNDED",
                value: "REFUNDED"
              }
            ]
          },
          UserRole: {
            codecId: "pg/text@1",
            members: [
              {
                name: "CUSTOMER",
                value: "CUSTOMER"
              },
              {
                name: "DELIVERY_AGENT",
                value: "DELIVERY_AGENT"
              },
              {
                name: "ADMIN",
                value: "ADMIN"
              }
            ]
          }
        },
        models: {
          AuditLog: {
            fields: {
              action: {
                nullable: false,
                type: {
                  codecId: "pg/text@1",
                  kind: "scalar"
                }
              },
              createdAt: {
                nullable: false,
                type: {
                  codecId: "pg/timestamptz-string@1",
                  kind: "scalar"
                }
              },
              details: {
                nullable: true,
                type: {
                  codecId: "pg/text@1",
                  kind: "scalar"
                }
              },
              entity: {
                nullable: false,
                type: {
                  codecId: "pg/text@1",
                  kind: "scalar"
                }
              },
              entityId: {
                nullable: true,
                type: {
                  codecId: "pg/int4@1",
                  kind: "scalar"
                }
              },
              id: {
                nullable: false,
                type: {
                  codecId: "pg/int4@1",
                  kind: "scalar"
                }
              },
              userId: {
                nullable: true,
                type: {
                  codecId: "pg/int4@1",
                  kind: "scalar"
                }
              }
            },
            relations: {
              user: {
                cardinality: "N:1",
                nullable: true,
                on: {
                  localFields: [
                    "userId"
                  ],
                  targetFields: [
                    "id"
                  ]
                },
                to: {
                  model: "User",
                  namespace: "public"
                }
              }
            },
            storage: {
              fields: {
                action: {
                  column: "action"
                },
                createdAt: {
                  column: "createdAt"
                },
                details: {
                  column: "details"
                },
                entity: {
                  column: "entity"
                },
                entityId: {
                  column: "entityId"
                },
                id: {
                  column: "id"
                },
                userId: {
                  column: "userId"
                }
              },
              namespaceId: "public",
              table: "AuditLog"
            }
          },
          Parcel: {
            fields: {
              createdAt: {
                nullable: false,
                type: {
                  codecId: "pg/timestamptz-string@1",
                  kind: "scalar"
                }
              },
              deletedAt: {
                nullable: true,
                type: {
                  codecId: "pg/timestamptz-string@1",
                  kind: "scalar"
                }
              },
              deliveryAddress: {
                nullable: false,
                type: {
                  codecId: "pg/text@1",
                  kind: "scalar"
                }
              },
              deliveryAgentId: {
                nullable: true,
                type: {
                  codecId: "pg/int4@1",
                  kind: "scalar"
                }
              },
              deliveryFee: {
                nullable: false,
                type: {
                  codecId: "pg/float8@1",
                  kind: "scalar"
                }
              },
              id: {
                nullable: false,
                type: {
                  codecId: "pg/int4@1",
                  kind: "scalar"
                }
              },
              pickupAddress: {
                nullable: false,
                type: {
                  codecId: "pg/text@1",
                  kind: "scalar"
                }
              },
              receiverName: {
                nullable: false,
                type: {
                  codecId: "pg/text@1",
                  kind: "scalar"
                }
              },
              receiverPhone: {
                nullable: false,
                type: {
                  codecId: "pg/text@1",
                  kind: "scalar"
                }
              },
              senderId: {
                nullable: false,
                type: {
                  codecId: "pg/int4@1",
                  kind: "scalar"
                }
              },
              status: {
                nullable: false,
                type: {
                  codecId: "pg/text@1",
                  kind: "scalar"
                },
                valueSet: {
                  entityKind: "enum",
                  entityName: "ParcelStatus",
                  namespaceId: "public",
                  plane: "domain"
                }
              },
              trackingNumber: {
                nullable: false,
                type: {
                  codecId: "pg/text@1",
                  kind: "scalar"
                }
              },
              updatedAt: {
                nullable: false,
                type: {
                  codecId: "pg/timestamptz-string@1",
                  kind: "scalar"
                }
              },
              weight: {
                nullable: false,
                type: {
                  codecId: "pg/float8@1",
                  kind: "scalar"
                }
              }
            },
            relations: {
              deliveryAgent: {
                cardinality: "N:1",
                nullable: true,
                on: {
                  localFields: [
                    "deliveryAgentId"
                  ],
                  targetFields: [
                    "id"
                  ]
                },
                to: {
                  model: "User",
                  namespace: "public"
                }
              },
              payment: {
                cardinality: "1:1",
                nullable: true,
                on: {
                  localFields: [
                    "id"
                  ],
                  targetFields: [
                    "parcelId"
                  ]
                },
                to: {
                  model: "Payment",
                  namespace: "public"
                }
              },
              sender: {
                cardinality: "N:1",
                nullable: false,
                on: {
                  localFields: [
                    "senderId"
                  ],
                  targetFields: [
                    "id"
                  ]
                },
                to: {
                  model: "User",
                  namespace: "public"
                }
              },
              trackingHistory: {
                cardinality: "1:N",
                on: {
                  localFields: [
                    "id"
                  ],
                  targetFields: [
                    "parcelId"
                  ]
                },
                to: {
                  model: "ParcelTracking",
                  namespace: "public"
                }
              }
            },
            storage: {
              fields: {
                createdAt: {
                  column: "createdAt"
                },
                deletedAt: {
                  column: "deletedAt"
                },
                deliveryAddress: {
                  column: "deliveryAddress"
                },
                deliveryAgentId: {
                  column: "deliveryAgentId"
                },
                deliveryFee: {
                  column: "deliveryFee"
                },
                id: {
                  column: "id"
                },
                pickupAddress: {
                  column: "pickupAddress"
                },
                receiverName: {
                  column: "receiverName"
                },
                receiverPhone: {
                  column: "receiverPhone"
                },
                senderId: {
                  column: "senderId"
                },
                status: {
                  column: "status"
                },
                trackingNumber: {
                  column: "trackingNumber"
                },
                updatedAt: {
                  column: "updatedAt"
                },
                weight: {
                  column: "weight"
                }
              },
              namespaceId: "public",
              table: "Parcel"
            }
          },
          ParcelTracking: {
            fields: {
              createdAt: {
                nullable: false,
                type: {
                  codecId: "pg/timestamptz-string@1",
                  kind: "scalar"
                }
              },
              id: {
                nullable: false,
                type: {
                  codecId: "pg/int4@1",
                  kind: "scalar"
                }
              },
              location: {
                nullable: true,
                type: {
                  codecId: "pg/text@1",
                  kind: "scalar"
                }
              },
              note: {
                nullable: true,
                type: {
                  codecId: "pg/text@1",
                  kind: "scalar"
                }
              },
              parcelId: {
                nullable: false,
                type: {
                  codecId: "pg/int4@1",
                  kind: "scalar"
                }
              },
              status: {
                nullable: false,
                type: {
                  codecId: "pg/text@1",
                  kind: "scalar"
                },
                valueSet: {
                  entityKind: "enum",
                  entityName: "ParcelStatus",
                  namespaceId: "public",
                  plane: "domain"
                }
              }
            },
            relations: {
              parcel: {
                cardinality: "N:1",
                nullable: false,
                on: {
                  localFields: [
                    "parcelId"
                  ],
                  targetFields: [
                    "id"
                  ]
                },
                to: {
                  model: "Parcel",
                  namespace: "public"
                }
              }
            },
            storage: {
              fields: {
                createdAt: {
                  column: "createdAt"
                },
                id: {
                  column: "id"
                },
                location: {
                  column: "location"
                },
                note: {
                  column: "note"
                },
                parcelId: {
                  column: "parcelId"
                },
                status: {
                  column: "status"
                }
              },
              namespaceId: "public",
              table: "ParcelTracking"
            }
          },
          Payment: {
            fields: {
              amount: {
                nullable: false,
                type: {
                  codecId: "pg/float8@1",
                  kind: "scalar"
                }
              },
              createdAt: {
                nullable: false,
                type: {
                  codecId: "pg/timestamptz-string@1",
                  kind: "scalar"
                }
              },
              currency: {
                nullable: false,
                type: {
                  codecId: "pg/text@1",
                  kind: "scalar"
                }
              },
              id: {
                nullable: false,
                type: {
                  codecId: "pg/int4@1",
                  kind: "scalar"
                }
              },
              parcelId: {
                nullable: false,
                type: {
                  codecId: "pg/int4@1",
                  kind: "scalar"
                }
              },
              status: {
                nullable: false,
                type: {
                  codecId: "pg/text@1",
                  kind: "scalar"
                },
                valueSet: {
                  entityKind: "enum",
                  entityName: "PaymentStatus",
                  namespaceId: "public",
                  plane: "domain"
                }
              },
              stripeSessionId: {
                nullable: true,
                type: {
                  codecId: "pg/text@1",
                  kind: "scalar"
                }
              },
              updatedAt: {
                nullable: false,
                type: {
                  codecId: "pg/timestamptz-string@1",
                  kind: "scalar"
                }
              }
            },
            relations: {
              parcel: {
                cardinality: "N:1",
                nullable: false,
                on: {
                  localFields: [
                    "parcelId"
                  ],
                  targetFields: [
                    "id"
                  ]
                },
                to: {
                  model: "Parcel",
                  namespace: "public"
                }
              }
            },
            storage: {
              fields: {
                amount: {
                  column: "amount"
                },
                createdAt: {
                  column: "createdAt"
                },
                currency: {
                  column: "currency"
                },
                id: {
                  column: "id"
                },
                parcelId: {
                  column: "parcelId"
                },
                status: {
                  column: "status"
                },
                stripeSessionId: {
                  column: "stripeSessionId"
                },
                updatedAt: {
                  column: "updatedAt"
                }
              },
              namespaceId: "public",
              table: "Payment"
            }
          },
          User: {
            fields: {
              createdAt: {
                nullable: false,
                type: {
                  codecId: "pg/timestamptz-string@1",
                  kind: "scalar"
                }
              },
              deletedAt: {
                nullable: true,
                type: {
                  codecId: "pg/timestamptz-string@1",
                  kind: "scalar"
                }
              },
              email: {
                nullable: false,
                type: {
                  codecId: "pg/text@1",
                  kind: "scalar"
                }
              },
              id: {
                nullable: false,
                type: {
                  codecId: "pg/int4@1",
                  kind: "scalar"
                }
              },
              name: {
                nullable: false,
                type: {
                  codecId: "pg/text@1",
                  kind: "scalar"
                }
              },
              password: {
                nullable: false,
                type: {
                  codecId: "pg/text@1",
                  kind: "scalar"
                }
              },
              phone: {
                nullable: true,
                type: {
                  codecId: "pg/text@1",
                  kind: "scalar"
                }
              },
              role: {
                nullable: false,
                type: {
                  codecId: "pg/text@1",
                  kind: "scalar"
                },
                valueSet: {
                  entityKind: "enum",
                  entityName: "UserRole",
                  namespaceId: "public",
                  plane: "domain"
                }
              },
              updatedAt: {
                nullable: false,
                type: {
                  codecId: "pg/timestamptz-string@1",
                  kind: "scalar"
                }
              }
            },
            relations: {
              assignedParcels: {
                cardinality: "1:N",
                on: {
                  localFields: [
                    "id"
                  ],
                  targetFields: [
                    "deliveryAgentId"
                  ]
                },
                to: {
                  model: "Parcel",
                  namespace: "public"
                }
              },
              auditLogs: {
                cardinality: "1:N",
                on: {
                  localFields: [
                    "id"
                  ],
                  targetFields: [
                    "userId"
                  ]
                },
                to: {
                  model: "AuditLog",
                  namespace: "public"
                }
              },
              parcels: {
                cardinality: "1:N",
                on: {
                  localFields: [
                    "id"
                  ],
                  targetFields: [
                    "senderId"
                  ]
                },
                to: {
                  model: "Parcel",
                  namespace: "public"
                }
              }
            },
            storage: {
              fields: {
                createdAt: {
                  column: "createdAt"
                },
                deletedAt: {
                  column: "deletedAt"
                },
                email: {
                  column: "email"
                },
                id: {
                  column: "id"
                },
                name: {
                  column: "name"
                },
                password: {
                  column: "password"
                },
                phone: {
                  column: "phone"
                },
                role: {
                  column: "role"
                },
                updatedAt: {
                  column: "updatedAt"
                }
              },
              namespaceId: "public",
              table: "User"
            }
          }
        }
      }
    }
  },
  storage: {
    namespaces: {
      public: {
        entries: {
          table: {
            AuditLog: {
              columns: {
                action: {
                  codecId: "pg/text@1",
                  nativeType: "text",
                  nullable: false
                },
                createdAt: {
                  codecId: "pg/timestamptz-string@1",
                  default: {
                    expression: "now()",
                    kind: "function"
                  },
                  nativeType: "timestamptz",
                  nullable: false
                },
                details: {
                  codecId: "pg/text@1",
                  nativeType: "text",
                  nullable: true
                },
                entity: {
                  codecId: "pg/text@1",
                  nativeType: "text",
                  nullable: false
                },
                entityId: {
                  codecId: "pg/int4@1",
                  nativeType: "int4",
                  nullable: true
                },
                id: {
                  codecId: "pg/int4@1",
                  default: {
                    expression: "autoincrement()",
                    kind: "function"
                  },
                  nativeType: "int4",
                  nullable: false
                },
                userId: {
                  codecId: "pg/int4@1",
                  nativeType: "int4",
                  nullable: true
                }
              },
              foreignKeys: [
                {
                  source: {
                    columns: [
                      "userId"
                    ],
                    namespaceId: "public",
                    tableName: "AuditLog"
                  },
                  target: {
                    columns: [
                      "id"
                    ],
                    namespaceId: "public",
                    tableName: "User"
                  }
                }
              ],
              indexes: [
                {
                  columns: [
                    "userId"
                  ],
                  name: "AuditLog_userId_idx_a489d58a",
                  prefix: "AuditLog_userId_idx",
                  unique: false
                }
              ],
              primaryKey: {
                columns: [
                  "id"
                ]
              },
              uniques: []
            },
            Parcel: {
              checks: [
                {
                  expression: `"status" IN ('PENDING', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED')`,
                  name: "Parcel_status_check_5d49de73",
                  prefix: "Parcel_status_check"
                }
              ],
              columns: {
                createdAt: {
                  codecId: "pg/timestamptz-string@1",
                  default: {
                    expression: "now()",
                    kind: "function"
                  },
                  nativeType: "timestamptz",
                  nullable: false
                },
                deletedAt: {
                  codecId: "pg/timestamptz-string@1",
                  nativeType: "timestamptz",
                  nullable: true
                },
                deliveryAddress: {
                  codecId: "pg/text@1",
                  nativeType: "text",
                  nullable: false
                },
                deliveryAgentId: {
                  codecId: "pg/int4@1",
                  nativeType: "int4",
                  nullable: true
                },
                deliveryFee: {
                  codecId: "pg/float8@1",
                  nativeType: "float8",
                  nullable: false
                },
                id: {
                  codecId: "pg/int4@1",
                  default: {
                    expression: "autoincrement()",
                    kind: "function"
                  },
                  nativeType: "int4",
                  nullable: false
                },
                pickupAddress: {
                  codecId: "pg/text@1",
                  nativeType: "text",
                  nullable: false
                },
                receiverName: {
                  codecId: "pg/text@1",
                  nativeType: "text",
                  nullable: false
                },
                receiverPhone: {
                  codecId: "pg/text@1",
                  nativeType: "text",
                  nullable: false
                },
                senderId: {
                  codecId: "pg/int4@1",
                  nativeType: "int4",
                  nullable: false
                },
                status: {
                  codecId: "pg/text@1",
                  default: {
                    kind: "literal",
                    value: "PENDING"
                  },
                  nativeType: "text",
                  nullable: false,
                  valueSet: {
                    entityKind: "valueSet",
                    entityName: "ParcelStatus",
                    namespaceId: "public",
                    plane: "storage"
                  }
                },
                trackingNumber: {
                  codecId: "pg/text@1",
                  nativeType: "text",
                  nullable: false
                },
                updatedAt: {
                  codecId: "pg/timestamptz-string@1",
                  nativeType: "timestamptz",
                  nullable: false
                },
                weight: {
                  codecId: "pg/float8@1",
                  nativeType: "float8",
                  nullable: false
                }
              },
              foreignKeys: [
                {
                  source: {
                    columns: [
                      "senderId"
                    ],
                    namespaceId: "public",
                    tableName: "Parcel"
                  },
                  target: {
                    columns: [
                      "id"
                    ],
                    namespaceId: "public",
                    tableName: "User"
                  }
                },
                {
                  source: {
                    columns: [
                      "deliveryAgentId"
                    ],
                    namespaceId: "public",
                    tableName: "Parcel"
                  },
                  target: {
                    columns: [
                      "id"
                    ],
                    namespaceId: "public",
                    tableName: "User"
                  }
                }
              ],
              indexes: [
                {
                  columns: [
                    "deliveryAgentId"
                  ],
                  name: "Parcel_deliveryAgentId_idx_42030b3e",
                  prefix: "Parcel_deliveryAgentId_idx",
                  unique: false
                },
                {
                  columns: [
                    "senderId"
                  ],
                  name: "Parcel_senderId_idx_4689c490",
                  prefix: "Parcel_senderId_idx",
                  unique: false
                }
              ],
              primaryKey: {
                columns: [
                  "id"
                ]
              },
              uniques: [
                {
                  columns: [
                    "trackingNumber"
                  ]
                }
              ]
            },
            ParcelTracking: {
              checks: [
                {
                  expression: `"status" IN ('PENDING', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED')`,
                  name: "ParcelTracking_status_check_5d49de73",
                  prefix: "ParcelTracking_status_check"
                }
              ],
              columns: {
                createdAt: {
                  codecId: "pg/timestamptz-string@1",
                  default: {
                    expression: "now()",
                    kind: "function"
                  },
                  nativeType: "timestamptz",
                  nullable: false
                },
                id: {
                  codecId: "pg/int4@1",
                  default: {
                    expression: "autoincrement()",
                    kind: "function"
                  },
                  nativeType: "int4",
                  nullable: false
                },
                location: {
                  codecId: "pg/text@1",
                  nativeType: "text",
                  nullable: true
                },
                note: {
                  codecId: "pg/text@1",
                  nativeType: "text",
                  nullable: true
                },
                parcelId: {
                  codecId: "pg/int4@1",
                  nativeType: "int4",
                  nullable: false
                },
                status: {
                  codecId: "pg/text@1",
                  nativeType: "text",
                  nullable: false,
                  valueSet: {
                    entityKind: "valueSet",
                    entityName: "ParcelStatus",
                    namespaceId: "public",
                    plane: "storage"
                  }
                }
              },
              foreignKeys: [
                {
                  source: {
                    columns: [
                      "parcelId"
                    ],
                    namespaceId: "public",
                    tableName: "ParcelTracking"
                  },
                  target: {
                    columns: [
                      "id"
                    ],
                    namespaceId: "public",
                    tableName: "Parcel"
                  }
                }
              ],
              indexes: [
                {
                  columns: [
                    "parcelId"
                  ],
                  name: "ParcelTracking_parcelId_idx_1343b2cb",
                  prefix: "ParcelTracking_parcelId_idx",
                  unique: false
                }
              ],
              primaryKey: {
                columns: [
                  "id"
                ]
              },
              uniques: []
            },
            Payment: {
              checks: [
                {
                  expression: `"status" IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')`,
                  name: "Payment_status_check_7d4c17ff",
                  prefix: "Payment_status_check"
                }
              ],
              columns: {
                amount: {
                  codecId: "pg/float8@1",
                  nativeType: "float8",
                  nullable: false
                },
                createdAt: {
                  codecId: "pg/timestamptz-string@1",
                  default: {
                    expression: "now()",
                    kind: "function"
                  },
                  nativeType: "timestamptz",
                  nullable: false
                },
                currency: {
                  codecId: "pg/text@1",
                  default: {
                    kind: "literal",
                    value: "BDT"
                  },
                  nativeType: "text",
                  nullable: false
                },
                id: {
                  codecId: "pg/int4@1",
                  default: {
                    expression: "autoincrement()",
                    kind: "function"
                  },
                  nativeType: "int4",
                  nullable: false
                },
                parcelId: {
                  codecId: "pg/int4@1",
                  nativeType: "int4",
                  nullable: false
                },
                status: {
                  codecId: "pg/text@1",
                  default: {
                    kind: "literal",
                    value: "PENDING"
                  },
                  nativeType: "text",
                  nullable: false,
                  valueSet: {
                    entityKind: "valueSet",
                    entityName: "PaymentStatus",
                    namespaceId: "public",
                    plane: "storage"
                  }
                },
                stripeSessionId: {
                  codecId: "pg/text@1",
                  nativeType: "text",
                  nullable: true
                },
                updatedAt: {
                  codecId: "pg/timestamptz-string@1",
                  nativeType: "timestamptz",
                  nullable: false
                }
              },
              foreignKeys: [
                {
                  source: {
                    columns: [
                      "parcelId"
                    ],
                    namespaceId: "public",
                    tableName: "Payment"
                  },
                  target: {
                    columns: [
                      "id"
                    ],
                    namespaceId: "public",
                    tableName: "Parcel"
                  }
                }
              ],
              indexes: [],
              primaryKey: {
                columns: [
                  "id"
                ]
              },
              uniques: [
                {
                  columns: [
                    "parcelId"
                  ]
                },
                {
                  columns: [
                    "stripeSessionId"
                  ]
                }
              ]
            },
            User: {
              checks: [
                {
                  expression: `"role" IN ('CUSTOMER', 'DELIVERY_AGENT', 'ADMIN')`,
                  name: "User_role_check_625aa0e9",
                  prefix: "User_role_check"
                }
              ],
              columns: {
                createdAt: {
                  codecId: "pg/timestamptz-string@1",
                  default: {
                    expression: "now()",
                    kind: "function"
                  },
                  nativeType: "timestamptz",
                  nullable: false
                },
                deletedAt: {
                  codecId: "pg/timestamptz-string@1",
                  nativeType: "timestamptz",
                  nullable: true
                },
                email: {
                  codecId: "pg/text@1",
                  nativeType: "text",
                  nullable: false
                },
                id: {
                  codecId: "pg/int4@1",
                  default: {
                    expression: "autoincrement()",
                    kind: "function"
                  },
                  nativeType: "int4",
                  nullable: false
                },
                name: {
                  codecId: "pg/text@1",
                  nativeType: "text",
                  nullable: false
                },
                password: {
                  codecId: "pg/text@1",
                  nativeType: "text",
                  nullable: false
                },
                phone: {
                  codecId: "pg/text@1",
                  nativeType: "text",
                  nullable: true
                },
                role: {
                  codecId: "pg/text@1",
                  default: {
                    kind: "literal",
                    value: "CUSTOMER"
                  },
                  nativeType: "text",
                  nullable: false,
                  valueSet: {
                    entityKind: "valueSet",
                    entityName: "UserRole",
                    namespaceId: "public",
                    plane: "storage"
                  }
                },
                updatedAt: {
                  codecId: "pg/timestamptz-string@1",
                  nativeType: "timestamptz",
                  nullable: false
                }
              },
              foreignKeys: [],
              indexes: [],
              primaryKey: {
                columns: [
                  "id"
                ]
              },
              uniques: [
                {
                  columns: [
                    "email"
                  ]
                }
              ]
            }
          },
          valueSet: {
            ParcelStatus: {
              kind: "valueSet",
              values: [
                "PENDING",
                "PICKED_UP",
                "IN_TRANSIT",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "CANCELLED"
              ]
            },
            PaymentStatus: {
              kind: "valueSet",
              values: [
                "PENDING",
                "PAID",
                "FAILED",
                "REFUNDED"
              ]
            },
            UserRole: {
              kind: "valueSet",
              values: [
                "CUSTOMER",
                "DELIVERY_AGENT",
                "ADMIN"
              ]
            }
          }
        },
        id: "public",
        kind: "postgres-schema"
      }
    },
    storageHash: "b8512011c4d5bfb4b063c5de4e9d5c6ece8f7c62adc50bab0e86cf2e000b32b8"
  },
  execution: {
    executionHash: "7d46a96449c1d5203c202d7a61e940ec9f449fccc196d9585e7cbb4d603e950f",
    mutations: {
      defaults: [
        {
          onCreate: {
            id: "timestampNow",
            kind: "generator"
          },
          onUpdate: {
            id: "timestampNow",
            kind: "generator"
          },
          ref: {
            entry: "Parcel",
            field: "updatedAt",
            namespace: "public"
          }
        },
        {
          onCreate: {
            id: "timestampNow",
            kind: "generator"
          },
          onUpdate: {
            id: "timestampNow",
            kind: "generator"
          },
          ref: {
            entry: "Payment",
            field: "updatedAt",
            namespace: "public"
          }
        },
        {
          onCreate: {
            id: "timestampNow",
            kind: "generator"
          },
          onUpdate: {
            id: "timestampNow",
            kind: "generator"
          },
          ref: {
            entry: "User",
            field: "updatedAt",
            namespace: "public"
          }
        }
      ]
    }
  },
  capabilities: {
    postgres: {
      distinctOn: true,
      jsonAgg: true,
      lateral: true,
      limit: true,
      orderBy: true,
      returning: true
    },
    sql: {
      checkConstraint: true,
      defaultInInsert: true,
      enums: true,
      insertOnConflictSkip: true,
      insertOnConflictWithoutTarget: true,
      lateral: true,
      returning: true,
      scalarList: true
    }
  },
  extensions: {},
  meta: {},
  _generated: {
    warning: "\u26A0\uFE0F  GENERATED FILE - DO NOT EDIT",
    message: 'This file is automatically generated by "prisma contract emit".',
    regenerate: "To regenerate, run: prisma contract emit"
  }
};

// src/prisma/db.ts
var db = postgres({
  contractJson: contract_default,
  url: process.env.DATABASE_URL
});
var db_default = db;

// src/errors/ApiError.ts
var ApiError = class extends Error {
  statusCode;
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
    Error.captureStackTrace(this, this.constructor);
  }
};
var ApiError_default = ApiError;

// src/modules/auth/auth.service.ts
var register = async (payload) => {
  const existingUser = await db_default.orm.public.User.where({ email: payload.email }).first();
  if (existingUser) {
    throw new ApiError_default(409, "User with this email already exists");
  }
  const hashedPassword = await bcrypt.hash(payload.password, 12);
  const user = await db_default.orm.public.User.create({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
    phone: payload.phone
  });
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  };
};
var login = async (payload) => {
  const user = await db_default.orm.public.User.first({
    email: payload.email
  });
  if (!user) {
    throw new ApiError_default(401, "Invalid email or password");
  }
  const isPasswordCorrect = await bcrypt.compare(
    payload.password,
    user.password
  );
  if (!isPasswordCorrect) {
    throw new ApiError_default(401, "Invalid email or password");
  }
  const accessToken = createToken(
    {
      userId: user.id,
      role: user.role
    },
    config_default.jwt.accessSecret,
    "1d"
  );
  const refreshToken = createToken(
    {
      userId: user.id,
      role: user.role
    },
    config_default.jwt.refreshSecret,
    "7d"
  );
  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  };
};
var getMe = async (userId) => {
  const user = await db_default.orm.public.User.first({
    id: userId
  });
  if (!user) {
    throw new ApiError_default(404, "User not found");
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  };
};
var authService = {
  register,
  login,
  getMe
};

// src/modules/auth/auth.controller.ts
var register2 = async (req, res) => {
  const result = await authService.register(req.body);
  return sendResponse_default(res, {
    statusCode: 201,
    success: true,
    message: "Registration successful",
    data: result
  });
};
var login2 = async (req, res) => {
  const result = await authService.login(req.body);
  return sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: result
  });
};
var me = async (req, res) => {
  const result = await authService.getMe(req.user.userId);
  return sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "User information retrieved successfully",
    data: result
  });
};
var authController = {
  register: register2,
  login: login2,
  me
};

// src/modules/auth/auth.routes.ts
var router = Router();
router.post(
  "/register",
  validateRequest_default(registerSchema),
  authController.register
);
router.post(
  "/login",
  validateRequest_default(loginSchema),
  authController.login
);
router.get(
  "/me",
  auth_default,
  authController.me
);
var auth_routes_default = router;

// src/middleware/notFound.ts
var notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    errors: []
  });
};
var notFound_default = notFound;

// src/middleware/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";
  if (err instanceof ApiError_default) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }
  return res.status(statusCode).json({
    success: false,
    message,
    errors: []
  });
};
var globalErrorHandler_default = globalErrorHandler;

// src/modules/parcel/parcel.routes.ts
import { Router as Router2 } from "express";

// src/middleware/role.ts
var role = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized",
        errors: []
      });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
        errors: []
      });
    }
    next();
  };
};
var role_default = role;

// src/modules/parcel/parcel.validation.ts
import { z as z2 } from "zod";
var createParcelSchema = z2.object({
  receiverName: z2.string().min(2, "Receiver name must be at least 2 characters"),
  receiverPhone: z2.string().min(7, "Receiver phone is required"),
  pickupAddress: z2.string().min(5, "Pickup address must be at least 5 characters"),
  deliveryAddress: z2.string().min(5, "Delivery address must be at least 5 characters"),
  weight: z2.number().positive("Weight must be greater than 0"),
  deliveryFee: z2.number().positive("Delivery fee must be greater than 0")
});
var getMyParcelsSchema = z2.object({
  page: z2.coerce.number().int().positive().default(1),
  limit: z2.coerce.number().int().positive().max(100).default(10),
  status: z2.enum([
    "PENDING",
    "PICKED_UP",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED"
  ]).optional()
});
var cancelParcelSchema = z2.object({
  reason: z2.string().min(3, "Cancellation reason must be at least 3 characters").optional()
});
var getAvailableParcelsSchema = z2.object({
  page: z2.coerce.number().int().positive().default(1),
  limit: z2.coerce.number().int().positive().max(100).default(10)
});
var updateParcelStatusSchema = z2.object({
  status: z2.enum([
    "PICKED_UP",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "DELIVERED"
  ]),
  location: z2.string().optional(),
  note: z2.string().optional()
});
var getAssignedParcelsSchema = z2.object({
  page: z2.coerce.number().int().positive().default(1),
  limit: z2.coerce.number().int().positive().max(100).default(10),
  status: z2.enum([
    "PENDING",
    "PICKED_UP",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED"
  ]).optional()
});

// src/utils/createAuditLog.ts
var createAuditLog = async ({
  userId,
  action,
  entity,
  entityId,
  details
}) => {
  try {
    await db_default.orm.public.AuditLog.create({
      userId: userId ?? null,
      action,
      entity,
      entityId: entityId ?? null,
      details: details ?? null
    });
  } catch (err) {
    console.error("Audit log failed:", err);
  }
};
var createAuditLog_default = createAuditLog;

// src/modules/parcel/parcel.service.ts
var generateTrackingNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(1e3 + Math.random() * 9e3);
  return `CR-${timestamp}-${random}`;
};
var createParcel = async (senderId, payload) => {
  const trackingNumber = generateTrackingNumber();
  const parcel = await db_default.orm.public.Parcel.create({
    trackingNumber,
    senderId,
    receiverName: payload.receiverName,
    receiverPhone: payload.receiverPhone,
    pickupAddress: payload.pickupAddress,
    deliveryAddress: payload.deliveryAddress,
    weight: payload.weight,
    deliveryFee: payload.deliveryFee
  });
  await createAuditLog_default({
    userId: senderId,
    action: "CREATE",
    entity: "Parcel",
    entityId: parcel.id,
    details: `Parcel ${parcel.trackingNumber} created`
  });
  return parcel;
};
var getMyParcels = async (senderId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const status = query.status;
  const skip = (page - 1) * limit;
  const where = {
    senderId,
    deletedAt: null,
    ...status ? { status } : {}
  };
  const parcels = await db_default.orm.public.Parcel.where(where).orderBy((p) => p.createdAt.desc()).offset(skip).limit(limit).all();
  const aggResult = await db_default.orm.public.Parcel.where(where).aggregate((a) => ({
    total: a.count()
  }));
  const total = Number(aggResult.total);
  return {
    parcels,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getParcelById = async (parcelId, senderId) => {
  const parcel = await db_default.orm.public.Parcel.where({
    id: parcelId,
    senderId,
    deletedAt: null
  }).first();
  if (!parcel) {
    throw new ApiError_default(404, "Parcel not found");
  }
  return parcel;
};
var cancelParcel = async (parcelId, senderId) => {
  const parcel = await db_default.orm.public.Parcel.where({
    id: parcelId,
    senderId,
    deletedAt: null
  }).first();
  if (!parcel) {
    throw new ApiError_default(404, "Parcel not found");
  }
  if (parcel.status !== "PENDING") {
    throw new ApiError_default(400, "Only pending parcels can be cancelled");
  }
  const cancelledParcel = await db_default.orm.public.Parcel.where({ id: parcelId }).update({
    status: "CANCELLED",
    deletedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  if (!cancelledParcel) {
    throw new ApiError_default(500, "Failed to cancel parcel");
  }
  await createAuditLog_default({
    userId: senderId,
    action: "CANCEL",
    entity: "Parcel",
    entityId: parcel.id,
    details: `Parcel ${parcel.trackingNumber} cancelled`
  });
  return cancelledParcel;
};
var getAvailableParcels = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const where = {
    status: "PENDING",
    deliveryAgentId: null,
    deletedAt: null
  };
  const parcels = await db_default.orm.public.Parcel.where(where).orderBy((p) => p.createdAt.desc()).offset(skip).limit(limit).all();
  const aggResult = await db_default.orm.public.Parcel.where(where).aggregate((a) => ({
    total: a.count()
  }));
  const total = Number(aggResult.total);
  return {
    parcels,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var assignParcel = async (parcelId, deliveryAgentId) => {
  const parcel = await db_default.orm.public.Parcel.where({
    id: parcelId,
    deletedAt: null
  }).first();
  if (!parcel) {
    throw new ApiError_default(404, "Parcel not found");
  }
  if (parcel.status !== "PENDING") {
    throw new ApiError_default(400, "Only pending parcels can be assigned");
  }
  if (parcel.deliveryAgentId !== null) {
    throw new ApiError_default(400, "Parcel is already assigned to a delivery agent");
  }
  const updatedParcel = await db_default.orm.public.Parcel.where({ id: parcelId }).update({ deliveryAgentId });
  await createAuditLog_default({
    userId: deliveryAgentId,
    action: "ASSIGN",
    entity: "Parcel",
    entityId: parcel.id,
    details: `Parcel ${parcel.trackingNumber} assigned to delivery agent ${deliveryAgentId}`
  });
  return updatedParcel;
};
var updateParcelStatus = async (parcelId, deliveryAgentId, payload) => {
  const parcel = await db_default.orm.public.Parcel.where({ id: parcelId, deletedAt: null }).first();
  if (!parcel) {
    throw new ApiError_default(404, "Parcel not found");
  }
  if (parcel.deliveryAgentId !== deliveryAgentId) {
    throw new ApiError_default(403, "You are not assigned to this parcel");
  }
  const allowedTransitions = {
    PENDING: "PICKED_UP",
    PICKED_UP: "IN_TRANSIT",
    IN_TRANSIT: "OUT_FOR_DELIVERY",
    OUT_FOR_DELIVERY: "DELIVERED"
  };
  const nextStatus = allowedTransitions[parcel.status];
  if (nextStatus !== payload.status) {
    throw new ApiError_default(
      400,
      `Invalid status transition from ${parcel.status} to ${payload.status}`
    );
  }
  const updatedParcel = await db_default.orm.public.Parcel.where({ id: parcelId }).update({ status: payload.status });
  await db_default.orm.public.ParcelTracking.create({
    parcelId,
    status: payload.status,
    location: payload.location,
    note: payload.note
  });
  await createAuditLog_default({
    userId: deliveryAgentId,
    action: "UPDATE_STATUS",
    entity: "Parcel",
    entityId: parcel.id,
    details: `Parcel ${parcel.trackingNumber} status changed from ${parcel.status} to ${payload.status}`
  });
  return updatedParcel;
};
var getTrackingHistory = async (parcelId, senderId) => {
  const parcel = await db_default.orm.public.Parcel.where({
    id: parcelId,
    senderId,
    deletedAt: null
  }).first();
  if (!parcel) {
    throw new ApiError_default(404, "Parcel not found");
  }
  const history = await db_default.orm.public.ParcelTracking.where({ parcelId }).orderBy((t) => t.createdAt.asc()).all();
  return history;
};
var getAssignedParcels = async (deliveryAgentId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const status = query.status;
  const skip = (page - 1) * limit;
  const where = {
    deliveryAgentId,
    deletedAt: null,
    ...status ? { status } : {}
  };
  const parcels = await db_default.orm.public.Parcel.where(where).orderBy((p) => p.createdAt.desc()).offset(skip).limit(limit).all();
  const aggResult = await db_default.orm.public.Parcel.where(where).aggregate((a) => ({
    total: a.count()
  }));
  const total = Number(aggResult.total);
  return {
    parcels,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var parcelService = {
  createParcel,
  getMyParcels,
  getParcelById,
  cancelParcel,
  getAvailableParcels,
  assignParcel,
  updateParcelStatus,
  getTrackingHistory,
  getAssignedParcels
};

// src/modules/parcel/parcel.controller.ts
var createParcel2 = async (req, res) => {
  const result = await parcelService.createParcel(
    req.user.userId,
    req.body
  );
  return sendResponse_default(res, {
    statusCode: 201,
    success: true,
    message: "Parcel created successfully",
    data: result
  });
};
var getMyParcels2 = async (req, res) => {
  const query = req.validatedQuery;
  const result = await parcelService.getMyParcels(
    req.user.userId,
    query
  );
  return sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "My parcels retrieved successfully",
    data: result
  });
};
var getParcelById2 = async (req, res) => {
  const parcelId = Number(req.params.id);
  const result = await parcelService.getParcelById(
    parcelId,
    req.user.userId
  );
  return sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Parcel retrieved successfully",
    data: result
  });
};
var cancelParcel2 = async (req, res) => {
  const parcelId = Number(req.params.id);
  const result = await parcelService.cancelParcel(
    parcelId,
    req.user.userId
  );
  return sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Parcel cancelled successfully",
    data: result
  });
};
var getAvailableParcels2 = async (req, res) => {
  const query = req.validatedQuery ?? req.query;
  const result = await parcelService.getAvailableParcels(query);
  return sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Available parcels retrieved successfully",
    data: result
  });
};
var assignParcel2 = async (req, res) => {
  const parcelId = Number(req.params.id);
  const result = await parcelService.assignParcel(
    parcelId,
    req.user.userId
  );
  return sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Parcel assigned successfully",
    data: result
  });
};
var updateParcelStatus2 = async (req, res) => {
  const parcelId = Number(req.params.id);
  const result = await parcelService.updateParcelStatus(
    parcelId,
    req.user.userId,
    req.body
  );
  return sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Parcel status updated successfully",
    data: result
  });
};
var getTrackingHistory2 = async (req, res) => {
  const parcelId = Number(req.params.id);
  const result = await parcelService.getTrackingHistory(
    parcelId,
    req.user.userId
  );
  return sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Parcel tracking history retrieved successfully",
    data: result
  });
};
var getAssignedParcels2 = async (req, res) => {
  const query = req.validatedQuery ?? req.query;
  const result = await parcelService.getAssignedParcels(
    req.user.userId,
    query
  );
  return sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Assigned parcels retrieved successfully",
    data: result
  });
};
var parcelController = {
  createParcel: createParcel2,
  getMyParcels: getMyParcels2,
  getParcelById: getParcelById2,
  cancelParcel: cancelParcel2,
  getAvailableParcels: getAvailableParcels2,
  assignParcel: assignParcel2,
  updateParcelStatus: updateParcelStatus2,
  getTrackingHistory: getTrackingHistory2,
  getAssignedParcels: getAssignedParcels2
};

// src/modules/parcel/parcel.routes.ts
var router2 = Router2();
router2.post(
  "/",
  auth_default,
  role_default("CUSTOMER"),
  validateRequest_default(createParcelSchema),
  parcelController.createParcel
);
router2.get(
  "/my",
  auth_default,
  role_default("CUSTOMER"),
  validateRequest_default(getMyParcelsSchema, "query"),
  parcelController.getMyParcels
);
router2.get(
  "/available",
  auth_default,
  role_default("DELIVERY_AGENT"),
  validateRequest_default(getAvailableParcelsSchema, "query"),
  parcelController.getAvailableParcels
);
router2.get(
  "/assigned",
  auth_default,
  role_default("DELIVERY_AGENT"),
  validateRequest_default(getAssignedParcelsSchema, "query"),
  parcelController.getAssignedParcels
);
router2.get(
  "/:id/tracking",
  auth_default,
  role_default("CUSTOMER"),
  parcelController.getTrackingHistory
);
router2.get(
  "/:id",
  auth_default,
  role_default("CUSTOMER"),
  parcelController.getParcelById
);
router2.patch(
  "/:id/cancel",
  auth_default,
  role_default("CUSTOMER"),
  parcelController.cancelParcel
);
router2.patch(
  "/:id/assign",
  auth_default,
  role_default("DELIVERY_AGENT"),
  parcelController.assignParcel
);
router2.patch(
  "/:id/status",
  auth_default,
  role_default("DELIVERY_AGENT"),
  validateRequest_default(updateParcelStatusSchema),
  parcelController.updateParcelStatus
);
var parcel_routes_default = router2;

// src/modules/payment/payment.routes.ts
import { Router as Router3 } from "express";

// src/modules/payment/payment.validation.ts
import { z as z3 } from "zod";
var createPaymentSchema = z3.object({
  parcelId: z3.coerce.number().int().positive()
});
var createCheckoutSchema = z3.object({
  paymentId: z3.coerce.number().int().positive()
});
var getMyPaymentsSchema = z3.object({
  page: z3.coerce.number().int().positive().default(1),
  limit: z3.coerce.number().int().positive().max(100).default(10),
  status: z3.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).optional()
});

// src/utils/stripe.ts
import Stripe from "stripe";
var stripe = new Stripe(config_default.stripe.secretKey);
var stripe_default = stripe;

// src/modules/payment/payment.service.ts
var createPayment = async (customerId, payload) => {
  const parcel = await db_default.orm.public.Parcel.where({
    id: payload.parcelId,
    senderId: customerId,
    deletedAt: null
  }).first();
  if (!parcel) {
    throw new ApiError_default(404, "Parcel not found");
  }
  const existingPayment = await db_default.orm.public.Payment.where({ parcelId: parcel.id }).first();
  if (existingPayment) {
    throw new ApiError_default(400, "Payment already exists for this parcel");
  }
  const payment = await db_default.orm.public.Payment.create({
    parcelId: parcel.id,
    amount: parcel.deliveryFee,
    currency: "BDT",
    status: "PENDING"
  });
  await createAuditLog_default({
    userId: customerId,
    action: "CREATE",
    entity: "Payment",
    entityId: payment.id,
    details: `Payment created for parcel ${parcel.trackingNumber}`
  });
  return payment;
};
var createCheckoutSession = async (customerId, paymentId) => {
  const payment = await db_default.orm.public.Payment.where({ id: paymentId }).first();
  if (!payment) {
    throw new ApiError_default(404, "Payment not found");
  }
  const parcel = await db_default.orm.public.Parcel.where({
    id: payment.parcelId,
    senderId: customerId,
    deletedAt: null
  }).first();
  if (!parcel) {
    throw new ApiError_default(404, "Parcel not found");
  }
  if (payment.status !== "PENDING") {
    throw new ApiError_default(400, "This payment is not pending");
  }
  const session = await stripe_default.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: payment.currency.toLowerCase(),
          product_data: {
            name: `Courier Delivery - ${parcel.trackingNumber}`
          },
          unit_amount: Math.round(payment.amount * 100)
        },
        quantity: 1
      }
    ],
    metadata: {
      paymentId: String(payment.id),
      parcelId: String(parcel.id)
    },
    success_url: `${config_default.appUrl}/payment/success`,
    cancel_url: `${config_default.appUrl}/payment/cancel`
  });
  await db_default.orm.public.Payment.where({ id: payment.id }).update({ stripeSessionId: session.id });
  await createAuditLog_default({
    userId: customerId,
    action: "CREATE_CHECKOUT",
    entity: "Payment",
    entityId: payment.id,
    details: `Stripe checkout session created for payment ${payment.id}`
  });
  return {
    sessionId: session.id,
    checkoutUrl: session.url
  };
};
var getPaymentById = async (paymentId, customerId) => {
  const payment = await db_default.orm.public.Payment.where({ id: paymentId }).first();
  if (!payment) {
    throw new ApiError_default(404, "Payment not found");
  }
  const parcel = await db_default.orm.public.Parcel.where({
    id: payment.parcelId,
    senderId: customerId,
    deletedAt: null
  }).first();
  if (!parcel) {
    throw new ApiError_default(404, "Payment not found");
  }
  return payment;
};
var getMyPayments = async (customerId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const status = query.status;
  const skip = (page - 1) * limit;
  const customerParcels = await db_default.orm.public.Parcel.where({ senderId: customerId, deletedAt: null }).all();
  const parcelIds = customerParcels.map((p) => p.id);
  if (parcelIds.length === 0) {
    return {
      payments: [],
      meta: { page, limit, total: 0, totalPages: 0 }
    };
  }
  const where = (p) => {
    let condition = p.parcelId.in(parcelIds);
    if (status) {
      condition = condition.and(p.status.eq(status));
    }
    return condition;
  };
  const payments = await db_default.orm.public.Payment.where(where).orderBy((p) => p.createdAt.desc()).offset(skip).limit(limit).all();
  const aggResult = await db_default.orm.public.Payment.where(where).aggregate((a) => ({
    total: a.count()
  }));
  const total = Number(aggResult.total);
  return {
    payments,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var paymentService = {
  createPayment,
  createCheckoutSession,
  getPaymentById,
  getMyPayments
};

// src/modules/payment/payment.controller.ts
var createPayment2 = async (req, res) => {
  const result = await paymentService.createPayment(
    req.user.userId,
    req.body
  );
  return sendResponse_default(res, {
    statusCode: 201,
    success: true,
    message: "Payment created successfully",
    data: result
  });
};
var createCheckoutSession2 = async (req, res) => {
  const result = await paymentService.createCheckoutSession(
    req.user.userId,
    Number(req.params.id)
  );
  return sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Checkout session created successfully",
    data: result
  });
};
var getPaymentById2 = async (req, res) => {
  const result = await paymentService.getPaymentById(
    Number(req.params.id),
    req.user.userId
  );
  return sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Payment retrieved successfully",
    data: result
  });
};
var getMyPayments2 = async (req, res) => {
  const query = req.validatedQuery ?? req.query;
  const result = await paymentService.getMyPayments(
    req.user.userId,
    query
  );
  return sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Payment history retrieved successfully",
    data: result
  });
};
var paymentController = {
  createPayment: createPayment2,
  createCheckoutSession: createCheckoutSession2,
  getPaymentById: getPaymentById2,
  getMyPayments: getMyPayments2
};

// src/modules/payment/payment.routes.ts
var router3 = Router3();
router3.post(
  "/",
  auth_default,
  role_default("CUSTOMER"),
  validateRequest_default(createPaymentSchema),
  paymentController.createPayment
);
router3.post(
  "/:id/checkout",
  auth_default,
  role_default("CUSTOMER"),
  paymentController.createCheckoutSession
);
router3.get(
  "/:id",
  auth_default,
  role_default("CUSTOMER"),
  paymentController.getPaymentById
);
router3.get(
  "/my",
  auth_default,
  role_default("CUSTOMER"),
  validateRequest_default(getMyPaymentsSchema, "query"),
  paymentController.getMyPayments
);
var payment_routes_default = router3;

// src/modules/admin/admin.routes.ts
import { Router as Router4 } from "express";

// src/modules/admin/admin.validation.ts
import { z as z4 } from "zod";
var getUsersSchema = z4.object({
  page: z4.coerce.number().int().positive().default(1),
  limit: z4.coerce.number().int().positive().max(100).default(10),
  role: z4.enum(["CUSTOMER", "DELIVERY_AGENT", "ADMIN"]).optional()
});
var getAllParcelsSchema = z4.object({
  page: z4.coerce.number().int().positive().default(1),
  limit: z4.coerce.number().int().positive().max(100).default(10),
  status: z4.enum([
    "PENDING",
    "PICKED_UP",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED"
  ]).optional()
});
var getAuditLogsSchema = z4.object({
  page: z4.coerce.number().int().positive().default(1),
  limit: z4.coerce.number().int().positive().max(100).default(10),
  action: z4.string().optional(),
  entity: z4.string().optional()
});

// src/modules/admin/admin.service.ts
var getUsers = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const role2 = query.role;
  const skip = (page - 1) * limit;
  const where = {
    deletedAt: null,
    ...role2 ? { role: role2 } : {}
  };
  const users = await db_default.orm.public.User.where(where).orderBy((u) => u.createdAt.desc()).offset(skip).limit(limit).all();
  const aggResult = await db_default.orm.public.User.where(where).aggregate((a) => ({
    total: a.count()
  }));
  const total = Number(aggResult.total);
  const safeUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt
  }));
  return {
    users: safeUsers,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getAllParcels = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const status = query.status;
  const skip = (page - 1) * limit;
  const where = {
    deletedAt: null,
    ...status ? { status } : {}
  };
  const parcels = await db_default.orm.public.Parcel.where(where).orderBy((p) => p.createdAt.desc()).offset(skip).limit(limit).all();
  const aggResult = await db_default.orm.public.Parcel.where(where).aggregate((a) => ({
    total: a.count()
  }));
  const total = Number(aggResult.total);
  return {
    parcels,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getAuditLogs = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const action = query.action;
  const entity = query.entity;
  const skip = (page - 1) * limit;
  const where = {
    ...action ? { action } : {},
    ...entity ? { entity } : {}
  };
  const logs = await db_default.orm.public.AuditLog.where(where).orderBy((l) => l.createdAt.desc()).offset(skip).limit(limit).all();
  const aggResult = await db_default.orm.public.AuditLog.where(where).aggregate((a) => ({
    total: a.count()
  }));
  const total = Number(aggResult.total);
  return {
    logs,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var adminService = {
  getUsers,
  getAllParcels,
  getAuditLogs
};

// src/modules/admin/admin.controller.ts
var getUsers2 = async (req, res) => {
  const query = req.validatedQuery ?? req.query;
  const result = await adminService.getUsers(query);
  return sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data: result
  });
};
var getAllParcels2 = async (req, res) => {
  const query = req.validatedQuery ?? req.query;
  const result = await adminService.getAllParcels(query);
  return sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "All parcels retrieved successfully",
    data: result
  });
};
var getAuditLogs2 = async (req, res) => {
  const query = req.validatedQuery;
  const result = await adminService.getAuditLogs(query);
  return sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Audit logs retrieved successfully",
    data: result
  });
};
var adminController = {
  getUsers: getUsers2,
  getAllParcels: getAllParcels2,
  getAuditLogs: getAuditLogs2
};

// src/modules/admin/admin.routes.ts
var router4 = Router4();
router4.get(
  "/users",
  auth_default,
  role_default("ADMIN"),
  validateRequest_default(getUsersSchema, "query"),
  adminController.getUsers
);
router4.get(
  "/audit-logs",
  auth_default,
  role_default("ADMIN"),
  validateRequest_default(getAuditLogsSchema, "query"),
  adminController.getAuditLogs
);
router4.get(
  "/parcels",
  auth_default,
  role_default("ADMIN"),
  validateRequest_default(getAllParcelsSchema, "query"),
  adminController.getAllParcels
);
var admin_routes_default = router4;

// src/modules/payment/payment.webhook.routes.ts
import { Router as Router5 } from "express";

// src/modules/payment/payment.webhook.service.ts
var handleStripeWebhook = async (rawBody, signature) => {
  const event = stripe_default.webhooks.constructEvent(
    rawBody,
    signature,
    config_default.stripe.webhookSecret
  );
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const paymentId = Number(session.metadata?.paymentId);
    if (!paymentId) {
      return;
    }
    await db_default.orm.public.Payment.where({ id: paymentId }).update({ status: "PAID" });
    await createAuditLog_default({
      action: "PAYMENT_COMPLETED",
      entity: "Payment",
      entityId: paymentId,
      details: `Stripe payment completed for payment ${paymentId}`
    });
  }
};
var payment_webhook_service_default = handleStripeWebhook;

// src/modules/payment/payment.webhook.routes.ts
var router5 = Router5();
router5.post("/", async (req, res) => {
  const signature = req.headers["stripe-signature"];
  if (!signature || Array.isArray(signature)) {
    return res.status(400).json({
      success: false,
      message: "Missing Stripe signature",
      errors: []
    });
  }
  try {
    await payment_webhook_service_default(req.body, signature);
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return res.status(400).json({
      success: false,
      message: "Invalid Stripe webhook",
      errors: []
    });
  }
});
var payment_webhook_routes_default = router5;

// src/app/app.ts
var app = express();
app.use(helmet());
app.use(
  cors({
    origin: config_default.appUrl,
    credentials: true
  })
);
app.use(
  "/api/v1/payments/webhook",
  express.raw({ type: "application/json" }),
  payment_webhook_routes_default
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/health", (req, res) => {
  return sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "API is healthy",
    data: { status: "running" }
  });
});
app.get("/", (req, res) => {
  return res.send("Courier & Logistics Platform API is running!");
});
app.get("/test-error", (req, res, next) => {
  return next(new ApiError_default(400, "This is a test error"));
});
app.use("/api/v1/auth", auth_routes_default);
app.use("/api/v1/parcels", parcel_routes_default);
app.use("/api/v1/payments", payment_routes_default);
app.use("/api/v1/admin", admin_routes_default);
app.use(notFound_default);
app.use(globalErrorHandler_default);
var app_default = app;

// src/server.ts
var PORT = process.env.PORT || config_default.port || 5e3;
app_default.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
var server_default = app_default;
export {
  server_default as default
};
//# sourceMappingURL=server.js.map