import * as yup from 'yup';

/**
 * Validation Configuration
 * Set to false to disable all validation
 * Change this one value to turn validation on/off for all screens
 */
export const VALIDATION_ENABLED = false;

/**
 * Sign In Validation Schema
 */
export const signInSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

/**
 * Sign Up Validation Schema
 */
export const signUpSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().optional().default(''),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  dateOfBirth: yup.string().optional().default(''),
  gender: yup.string().optional().default(''),
  phone: yup.string().required('Phone number is required'),
  address: yup.string().optional().default(''),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], 'You must agree to the Terms & Conditions'),
});

export const validateWithSchema = async (
  schema: yup.AnyObjectSchema,
  data: Record<string, any>,
) => {
  if (!VALIDATION_ENABLED) {
    return { isValid: true, errors: {} };
  }

  try {
    await schema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      err.inner.forEach((error) => {
        if (error.path) {
          errors[error.path] = error.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: {} };
  }
};

/**
 * Helper function to validate a single field
 */
export const validateField = async (
  schema: yup.AnyObjectSchema,
  field: string,
  value: any,
  allData?: Record<string, any>,
) => {
  if (!VALIDATION_ENABLED) {
    return { isValid: true, error: undefined };
  }

  try {
    const data = allData ? { ...allData, [field]: value } : { [field]: value };
    await schema.validateAt(field, data);
    return { isValid: true, error: undefined };
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return { isValid: false, error: err.message };
    }
    return { isValid: true, error: undefined };
  }
};

