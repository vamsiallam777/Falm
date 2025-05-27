import { useApp } from '../context/AppContext';

export const useBookmarks = () => {
  const { bookmarks, addBookmark, removeBookmark, getBookmarkedEmployees } = useApp();

  const isBookmarked = (employeeId) => {
    return bookmarks.includes(employeeId);
  };

  const toggleBookmark = (employeeId) => {
    if (isBookmarked(employeeId)) {
      removeBookmark(employeeId);
    } else {
      addBookmark(employeeId);
    }
  };

  const bookmarkCount = bookmarks.length;
  const bookmarkedEmployees = getBookmarkedEmployees;

  return {
    bookmarks,
    bookmarkedEmployees,
    bookmarkCount,
    isBookmarked,
    toggleBookmark,
    addBookmark,
    removeBookmark,
  };
};