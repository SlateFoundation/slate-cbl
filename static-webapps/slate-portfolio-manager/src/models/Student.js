export default {
  getDisplayName(student) {
    const {
      FirstName, LastName, MiddleName, PreferredName,
    } = student;
    const parts = [FirstName, PreferredName ? `"${PreferredName}"` : MiddleName, LastName];
    return parts.filter(Boolean).join(' ');
  },
};
