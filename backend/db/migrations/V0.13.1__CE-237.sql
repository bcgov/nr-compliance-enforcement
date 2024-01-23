--
-- ALTER person_complaint_xref_code table add missing 
-- active_ind column, set default value true
--

ALTER TABLE public.person_complaint_xref_code
  ADD COLUMN IF NOT EXISTS active_ind boolean NOT NULL DEFAULT true;