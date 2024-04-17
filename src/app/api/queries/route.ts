import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export const POST = async (req: Request) => {
  const session = await auth();

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name, query, description } = await req.json();

  const newQuery = await prisma.query.create({
    data: { name, query, description },
  });

  return Response.json(newQuery, { status: 201 });
};

export const GET = async (req: NextRequest) => {
  const session = await auth();

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const params = req.nextUrl.searchParams;
  const search = params.get("search") || undefined;
  const limit = params.get("limit") || "10";
  const offset = params.get("offset") || "0";

  const queries = await prisma.query.findMany({
    take: parseInt(limit),
    skip: parseInt(offset),
    orderBy: { name: "asc" },
    where: search
      ? {
          OR: [
            { name: { startsWith: search } },
            { description: { contains: search } },
          ],
        }
      : undefined,
  });

  return Response.json(queries);
};
