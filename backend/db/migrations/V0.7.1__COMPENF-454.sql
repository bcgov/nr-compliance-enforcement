ALTER TABLE attractant_hwcr_xref ADD COLUMN active_ind bool NOT NULL DEFAULT(true);
ALTER TABLE attractant_hwcr_xref DROP CONSTRAINT uq_attrhwcrx;