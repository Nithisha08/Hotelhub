import { Pagination as MantinePagination } from "@mantine/core";
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }
  return (
    <MantinePagination
      value={currentPage}
      onChange={onPageChange}
      total={totalPages}
      mt="xl"
    />
  );
}
export default Pagination;