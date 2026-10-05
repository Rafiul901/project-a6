import db from "../prisma/db.js";

type CreateAuditLogParams = {
  userId?: number;
  action: string;
  entity: string;
  entityId?: number;
  details?: string;
};

const createAuditLog = async ({
  userId,
  action,
  entity,
  entityId,
  details,
}: CreateAuditLogParams) => {
  try {
    await db.orm.public.AuditLog.create({
      userId: userId ?? null,
      action,
      entity,
      entityId: entityId ?? null,
      details: details ?? null,
    });
  } catch (err) {
    // Don't fail the main action if audit logging fails
    console.error("Audit log failed:", err);
  }
};

export default createAuditLog;