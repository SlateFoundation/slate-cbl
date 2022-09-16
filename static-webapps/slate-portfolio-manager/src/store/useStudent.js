import defineRestStore from './defineRestStore';

export default defineRestStore({
  id: 'student',
  baseURL: '/people/*students',
  fromServer(students) {
    students.forEach((student) => {
      const {
        FirstName, LastName, MiddleName, PreferredName, NameSuffix,
      } = student;
      const parts = [FirstName, PreferredName ? `"${PreferredName}"` : MiddleName, LastName, NameSuffix];
      student.DisplayName = parts.filter(Boolean).join(' ');
    });
    return students;
  },
});
