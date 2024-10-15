import AddIcon from "@mui/icons-material/Add";
import { Alert, Button, CircularProgress, Container } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PaginationComponent from "~/components/pagination/Pagination";
import { CrudButton } from "~/components/shared/CrudButtonComponent";
import TableHeaderComponent from "~/components/shared/TableHeaderComponent";
import { MEMBER_MANAGEMENT_HEADER } from "~/constants/tableHeader";
import { Member, MembersResponse } from "~/types/users.type";
import { getMembersData } from "~/utils/apiUtils";
import { extractErrorMessage } from "~/utils/dataConverter";

const MemberManagement = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 8; // A

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true); // Set loading state to true
      try {
        const membersData = await getMembersData(page, itemsPerPage); // Use the utility function
        const data = membersData;

        if (data && Array.isArray(data.item)) {
          setMembers(data.item);
          setTotalPages(data.total_page);
        } else {
          throw new Error("Unexpected data structure");
        }
      } catch (error) {
        const errorMessage = extractErrorMessage(
          error,
          "Error fetching members",
        );
        setError(errorMessage);
        toast.error(errorMessage); // Notify user of the error
      } finally {
        setLoading(false); // Reset loading state
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
        <TableHeaderComponent headers={MEMBER_MANAGEMENT_HEADER} />
        <tbody className="divide-y bg-white dark:divide-gray-700 dark:bg-gray-800">
          {members.map((member) => (
            <tr key={member.id} className="text-gray-700 dark:text-gray-400">
              <td className="px-4 py-3 text-sm">{member.id}</td>
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
              <td className="px-4 py-3 text-sm">{member.first_name}</td>
              <td className="px-4 py-3 text-sm">{member.last_name}</td>
              <td className="px-4 py-3 text-sm">
                {member.phone_number || "Not provided"}
              </td>
              <td className="px-4 py-3 text-sm">{member.email}</td>
              <td className="px-4 py-3 text-sm">
                {member.address || "Not provided"}
              </td>
              <td className="px-4 py-3 text-sm">
                {member.status_name || "N/A"}
              </td>
              <td className="px-4 py-3 text-sm">
                {member.is_active ? "Active" : "Inactive"}
              </td>
              <td className="px-4 py-3 text-sm">{member.is_subscription}</td>
              <td className="px-4 py-3 text-sm">{member.date_of_birth}</td>
              <td className="px-4 py-3 text-sm">{member.account_balance}</td>
              <td className="px-4 py-3 text-sm">
                <div className="flex items-center space-x-4 text-sm">
                  <CrudButton
                    onClick={() => handleView(member.id)}
                    ariaLabel="View Member"
                    svgPath="view.svg"
                  />

                  <CrudButton
                    onClick={() => handleEdit(member.id)}
                    ariaLabel="Edit Member"
                    svgPath="edit.svg"
                  />

                  <CrudButton
                    onClick={() => handleDelete(member.id)}
                    ariaLabel="Delete Member"
                    svgPath="delete.svg"
                  />
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

export default MemberManagement;
