"use client";

import prisma from "@/lib/prisma";

type Props = {
  id: string;
};

export const DeleteButton = ({ id }: Props) => {
  const deleteQuery = async () => {
    if (confirm("Are you sure you want to delete this query?") === false) {
      return;
    }

    await prisma.query.delete({
      where: {
        id,
      },
    });
  };

  return (
    <button
      onClick={deleteQuery}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Delete
    </button>
  );
};
