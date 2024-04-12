import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { runQuery } from "@/lib/queries";
import { NextRequest } from "next/server";

type Params = {
  queryId: string;
};

export const GET = async (
  request: NextRequest,
  { params }: { params: Params },
) => {
  const session = await auth();

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { queryId } = params;
  const queryParams = request.nextUrl.searchParams;
  const query = await prisma.query.findUnique({
    where: { id: queryId },
  });

  if (!query) {
    return Response.json({ message: "Query not found" }, { status: 404 });
  }

  const result = await runQuery({ query: query.query, params: queryParams });

  return Response.json({ ...query, result });
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: Params },
) => {
  const session = await auth();

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name, query, description } = await request.json();

  const updatedQuery = await prisma.query.update({
    where: { id: params.queryId },
    data: { name, query, description },
  });

  return Response.json(updatedQuery);
};
