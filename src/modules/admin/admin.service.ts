import db from "../../prisma/db.js";

import type {
  GetUsersQuery,
  GetAllParcelsQuery,
  GetAuditLogsQuery,
} from "./admin.validation.js";

const getUsers = async (
  query: GetUsersQuery,
): Promise<{
  users: Array<{
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    createdAt: any;
  }>;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const role = query.role;
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    ...(role ? { role } : {}),
  };

  const users = await db.orm.public.User
    .where(where)
    .orderBy((u) => u.createdAt.desc())
    .offset(skip)
    .limit(limit)
    .all();

  const aggResult = await db.orm.public.User
    .where(where)
    .aggregate((a) => ({
      total: a.count(),
    }));

  const total = Number(aggResult.total);

  const safeUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  }));

  return {
    users: safeUsers,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getAllParcels = async (
  query: GetAllParcelsQuery,
): Promise<{
  parcels: any[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const status = query.status;
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    ...(status ? { status } : {}),
  };

  const parcels = await db.orm.public.Parcel
    .where(where)
    .orderBy((p) => p.createdAt.desc())
    .offset(skip)
    .limit(limit)
    .all();

  const aggResult = await db.orm.public.Parcel
    .where(where)
    .aggregate((a) => ({
      total: a.count(),
    }));

  const total = Number(aggResult.total);

  return {
    parcels,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getAuditLogs = async (
  query: GetAuditLogsQuery,
): Promise<{
  logs: any[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const action = query.action;
  const entity = query.entity;
  const skip = (page - 1) * limit;

  const where = {
    ...(action ? { action } : {}),
    ...(entity ? { entity } : {}),
  };

  const logs = await db.orm.public.AuditLog
    .where(where)
    .orderBy((l) => l.createdAt.desc())
    .offset(skip)
    .limit(limit)
    .all();

  const aggResult = await db.orm.public.AuditLog
    .where(where)
    .aggregate((a) => ({
      total: a.count(),
    }));

  const total = Number(aggResult.total);

  return {
    logs,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const adminService = {
  getUsers,
  getAllParcels,
  getAuditLogs,
};