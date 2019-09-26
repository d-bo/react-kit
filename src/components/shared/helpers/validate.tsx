/**
 * Validate email
 */
export const validateEmail = (email: string | null): boolean => {
  const re = /\S+@\S+\.\S+/;
  if (!re.test(email as string)) {
    return false;
  }
  return true;
};

/**
 * Validate password
 * @param password Input password
 */
export const validatePassword = (password: string): string | false => {
  if (password.length < 6) {
    return "Password minimum 6 symbols";
  }
  return false;
};

/**
 * Validate user name
 * @param displayName Input user name
 */
export const validateName = (displayName: string): string | false => {
  if (displayName.length < 6) {
    return "Name minimal 6 symbols length";
  }
  return false;
};
