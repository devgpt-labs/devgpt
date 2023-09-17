import setUsersEmail from "./setUsersEmail";

const validatePreferences = (
  preferences: any,
  session: any,
  user_id: string
) => {
  const { full_name, email } = preferences;
  if (full_name === null) {
    return false;
  }
  if (full_name?.length === 0) {
    return false;
  }
  if (email === null || email?.length === 0) {
    if (session.user.email !== null || session.user.email?.length !== 0) {
      setUsersEmail(user_id, session.user.email);
    } else {
      return false;
    }
  } else {
    return true;
  }
};

export default validatePreferences;
