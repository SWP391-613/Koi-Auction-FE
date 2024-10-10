import AddIcon from "@mui/icons-material/Add";
import { Alert, Button, CircularProgress, Container } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import PaginationComponent from "~/components/pagination/Pagination";
import { Member, MembersResponse } from "~/types/users.type";

const MemberList = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 8; // A

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get<MembersResponse>(
          "http://localhost:4000/api/v1/members",
          {
            params: {
              page: page - 1,
              limit: itemsPerPage,
            },
          },
        );

        const data = response.data;

        if (data && Array.isArray(data.item)) {
          setMembers(data.item);
          setTotalPages(data.total_page);
        } else {
          setError("Error fetching members");
        }
      } catch (err) {
        setError("Error fetching members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [page, itemsPerPage]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleCreate = () => {
    alert("Create new member");
  };

  const handleView = (id: number) => {
    // Implement view logic
    //template string
    alert(`View member ${id}`);
  };

  const handleEdit = (id: number) => {
    // Implement edit logic
    alert(`Edit member ${id}`);
  };

  const handleDelete = (id: number) => {
    // Implement delete logic
    alert(`Delete member ${id}`);
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Member Management</h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Add New Member
        </Button>
      </div>

      <table className="whitespace-no-wrap w-full">
        <thead>
          <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            <th className="px-4 py-3">Member</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Address</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y bg-white dark:divide-gray-700 dark:bg-gray-800">
          {members.map((member) => (
            <tr key={member.id} className="text-gray-700 dark:text-gray-400">
              <td className="px-4 py-3">
                <div className="flex items-center text-sm">
                  <div className="relative mr-3 hidden h-8 w-8 rounded-full md:block">
                    <img
                      className="h-full w-full rounded-full object-cover"
                      src={member.avatar_url}
                      alt=""
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0 rounded-full shadow-inner"
                      aria-hidden="true"
                    ></div>
                  </div>
                  <div>
                    <p className="font-semibold">{member.first_name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Member
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm">{member.email}</td>
              <td className="px-4 py-3 text-sm">{member.address}</td>
              <td className="px-4 py-3 text-sm">
                <div className="flex items-center space-x-4 text-sm">
                  <button
                    onClick={() => handleView(member.id)}
                    className="focus:shadow-outline-gray flex items-center justify-between rounded-lg px-2 py-2 text-sm font-medium leading-5 text-purple-100 focus:outline-none dark:text-gray-400"
                    aria-label="View"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleEdit(member.id)}
                    className="focus:shadow-outline-gray flex items-center justify-between rounded-lg px-2 py-2 text-sm font-medium leading-5 text-purple-100 focus:outline-none dark:text-gray-400"
                    aria-label="Edit"
                  >
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="focus:shadow-outline-gray flex items-center justify-between rounded-lg px-2 py-2 text-sm font-medium leading-5 text-purple-100 focus:outline-none dark:text-gray-400"
                    aria-label="Delete"
                  >
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="xs:flex-row xs:justify-between flex flex-col items-center border-t bg-white px-5 py-5">
        <PaginationComponent
          totalPages={totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default MemberList;
