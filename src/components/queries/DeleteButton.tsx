"use client";
import request from "axios";

type Props = {
  id: string;
};

export const DeleteButton = ({ id }: Props) => {
  const deleteQuery = async () => {
    if (confirm("Are you sure you want to delete this query?") === false) {
      return;
    }

    try {
      await request.delete(`/api/queries/${id}`);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to delete query, please try again.");
    }
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
