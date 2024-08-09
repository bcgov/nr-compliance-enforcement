CREATE OR REPLACE FUNCTION public.format_phone_number(phone_number text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
    formatted_phone_number TEXT;
BEGIN
    -- Remove all non-digit characters
    formatted_phone_number := regexp_replace(phone_number, '[^0-9]', '', 'g');
    IF (formatted_phone_number IS NULL or (length(formatted_phone_number) = 0)) then
		return null;
    END IF;
    -- Check if the first character is '1'
    IF left(formatted_phone_number, 1) = '1' THEN
        -- Add '+' in front of the phone number
        RETURN '+' || left(formatted_phone_number, 14);
    ELSE
        -- Add '+1' in front of the phone number
        RETURN '+1' || formatted_phone_number;
    END IF;
END;
$function$
;
