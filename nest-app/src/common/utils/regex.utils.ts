// Regex kiểm tra định dạng email
export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// Hàm kiểm tra email hợp lệ
export const isValidEmail = (email: string): boolean => emailRegex.test(email);

// Regex kiểm tra slug (chỉ gồm chữ thường, số và dấu gạch ngang)
export const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Hàm kiểm tra slug hợp lệ
export const isValidSlug = (slug: string): boolean => slugRegex.test(slug);

// Regex kiểm tra độ mạnh mật khẩu (ít nhất 1 số, 1 ký tự đặc biệt, dài 6–15 ký tự)
export const pwdStrongRegex =
  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,15}$/;
// Hàm kiểm tra mật khẩu mạnh
export const isStrongPassword = (password: string): boolean =>
  pwdStrongRegex.test(password);

// Regex kiểm tra chỉ chứa chữ in hoa (A–Z)
export const azUppercaseRegex = /^[A-Z]*$/;
// Hàm kiểm tra chuỗi chỉ gồm ký tự in hoa
export const isAllUppercase = (text: string): boolean =>
  azUppercaseRegex.test(text);

// Regex kiểm tra username (chữ, số, dấu chấm, dấu gạch dưới, dài 3–30 ký tự)
export const usernameRegex = /^[a-zA-Z0-9_.]{3,30}$/;
// Hàm kiểm tra username hợp lệ
export const isValidUsername = (username: string): boolean =>
  usernameRegex.test(username);

// Regex kiểm tra chỉ chứa ký tự alphabet (a–z, A–Z)
export const alphabetRegex = /^[a-zA-Z]*$/;
// Hàm kiểm tra chuỗi chỉ gồm chữ cái
export const isAlphabetOnly = (text: string): boolean =>
  alphabetRegex.test(text);

// Regex kiểm tra post type (chỉ chữ thường và dấu gạch ngang)
export const postTypeRegex = /^[a-z-]+$/;
// Hàm kiểm tra post type hợp lệ
export const isValidPostType = (text: string): boolean =>
  postTypeRegex.test(text);

// Regex kiểm tra chỉ chữ in hoa hoặc dấu gạch dưới
export const capitalLettersUnderscoresRegex = /^[A-Z_]+$/;
// Hàm kiểm tra chuỗi chỉ gồm chữ in hoa hoặc dấu gạch dưới
export const isValidCapitalLettersOrUnderscores = (text: string): boolean =>
  capitalLettersUnderscoresRegex.test(text);

// Regex kiểm tra chuỗi không chứa khoảng trắng
export const noWhitespaceRegex = /^\S*$/;
// Hàm kiểm tra chuỗi không có khoảng trắng
export const containsNoWhitespace = (text: string): boolean =>
  noWhitespaceRegex.test(text);

// Regex kiểm tra chỉ gồm ký tự chữ, số và ký tự đặc biệt cho phép
export const regexAlphaNumSpecial =
  /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]+$/;
// Hàm kiểm tra chuỗi chứa chỉ chữ, số hoặc ký tự đặc biệt
export const isAlphaNumSpecial = (text: string): boolean =>
  regexAlphaNumSpecial.test(text);
