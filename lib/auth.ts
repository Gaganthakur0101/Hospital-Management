import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export type AuthTokenPayload = jwt.JwtPayload & {
  id?: string;
  role?: "doctor" | "patient";
};

export const getAuthUserFromRequest = (request: NextRequest): AuthTokenPayload | null => {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthTokenPayload;
    if (!decoded?.id) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
};
