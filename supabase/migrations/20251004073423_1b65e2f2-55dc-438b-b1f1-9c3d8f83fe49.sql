-- Create a secure function to verify email/phone and generate reset code
CREATE OR REPLACE FUNCTION public.request_password_reset(
  user_email TEXT,
  user_phone TEXT
)
RETURNS TABLE (
  success BOOLEAN,
  reset_code TEXT,
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_code TEXT;
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- Verify email and phone match (case-insensitive email, trim whitespace)
  SELECT id INTO v_user_id
  FROM public.profiles
  WHERE LOWER(TRIM(email)) = LOWER(TRIM(user_email))
    AND TRIM(phone) = TRIM(user_phone);
  
  -- If no match found
  IF v_user_id IS NULL THEN
    RETURN QUERY SELECT false, NULL::TEXT, 'Email and phone number do not match our records'::TEXT;
    RETURN;
  END IF;
  
  -- Generate 6-digit code
  v_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
  v_expires_at := NOW() + INTERVAL '15 minutes';
  
  -- Store reset code
  UPDATE public.profiles
  SET 
    reset_code = v_code,
    reset_code_expires = v_expires_at,
    updated_at = NOW()
  WHERE id = v_user_id;
  
  -- Return success with code
  RETURN QUERY SELECT true, v_code, NULL::TEXT;
END;
$$;

-- Create a secure function to verify reset code and update password
CREATE OR REPLACE FUNCTION public.verify_reset_code(
  user_email TEXT,
  user_phone TEXT,
  code TEXT
)
RETURNS TABLE (
  success BOOLEAN,
  user_id UUID,
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_stored_code TEXT;
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- Get user profile with reset code info
  SELECT id, reset_code, reset_code_expires
  INTO v_user_id, v_stored_code, v_expires_at
  FROM public.profiles
  WHERE LOWER(TRIM(email)) = LOWER(TRIM(user_email))
    AND TRIM(phone) = TRIM(user_phone);
  
  -- If no match found
  IF v_user_id IS NULL THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Email and phone number do not match our records'::TEXT;
    RETURN;
  END IF;
  
  -- Verify reset code
  IF v_stored_code IS NULL OR v_stored_code != code THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Invalid reset code'::TEXT;
    RETURN;
  END IF;
  
  -- Check if code expired
  IF v_expires_at IS NULL OR v_expires_at < NOW() THEN
    RETURN QUERY SELECT false, NULL::UUID, 'Reset code has expired. Please request a new one.'::TEXT;
    RETURN;
  END IF;
  
  -- Clear reset code after successful verification
  UPDATE public.profiles
  SET 
    reset_code = NULL,
    reset_code_expires = NULL,
    updated_at = NOW()
  WHERE id = v_user_id;
  
  -- Return success with user_id
  RETURN QUERY SELECT true, v_user_id, NULL::TEXT;
END;
$$;