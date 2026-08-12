CREATE INDEX idx_professionals_name ON professionals (name);
CREATE INDEX idx_professionals_status ON professionals (status);
CREATE INDEX idx_professionals_department ON professionals (department_id);
CREATE INDEX idx_professionals_position ON professionals (position_id);
CREATE INDEX idx_contacts_professional ON contacts (professional_id);
