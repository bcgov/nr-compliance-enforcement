-- Insert people
INSERT INTO shared.person (person_guid, first_name, middle_name, middle_name_2, last_name, create_user_id, create_utc_timestamp)
VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Michael', 'Gary', NULL, 'Scott', 'system', NOW()),
    ('550e8400-e29b-41d4-a716-446655440002', 'Jim', 'Duncan', NULL, 'Halpert', 'system', NOW()),
    ('550e8400-e29b-41d4-a716-446655440003', 'Pam', 'Morgan', NULL, 'Beesly', 'system', NOW()),
    ('550e8400-e29b-41d4-a716-446655440004', 'Dwight', 'Kurt', NULL, 'Schrute', 'system', NOW()),
    ('550e8400-e29b-41d4-a716-446655440005', 'Angela', NULL, NULL, 'Martin', 'system', NOW()),
    ('550e8400-e29b-41d4-a716-446655440006', 'Kevin', NULL, NULL, 'Malone', 'system', NOW()),
    ('550e8400-e29b-41d4-a716-446655440007', 'Oscar', NULL, NULL, 'Martinez', 'system', NOW()),
    ('550e8400-e29b-41d4-a716-446655440008', 'Stanley', NULL, NULL, 'Hudson', 'system', NOW()),
    ('550e8400-e29b-41d4-a716-446655440009', 'Phyllis', NULL, NULL, 'Vance', 'system', NOW()),
    ('550e8400-e29b-41d4-a716-446655440010', 'Meredith', NULL, NULL, 'Palmer', 'system', NOW()),
    ('550e8400-e29b-41d4-a716-446655440011', 'Ryan', 'Bailey', NULL, 'Howard', 'system', NOW()),
    ('550e8400-e29b-41d4-a716-446655440012', 'Kelly', NULL, NULL, 'Kapoor', 'system', NOW()),
    ('550e8400-e29b-41d4-a716-446655440013', 'Toby', NULL, NULL, 'Flenderson', 'system', NOW()),
    ('550e8400-e29b-41d4-a716-446655440014', 'Creed', NULL, NULL, 'Bratton', 'system', NOW()),
    ('550e8400-e29b-41d4-a716-446655440015', 'Darryl', NULL, NULL, 'Philbin', 'system', NOW()),
    ('550e8400-e29b-41d4-a716-446655440016', 'Erin', NULL, NULL, 'Hannon', 'system', NOW()),
    ('550e8400-e29b-41d4-a716-446655440017', 'Andy', 'Baines', NULL, 'Bernard', 'system', NOW()),
    ('550e8400-e29b-41d4-a716-446655440018', 'Jan', NULL, NULL, 'Levinson', 'system', NOW()),
    ('550e8400-e29b-41d4-a716-446655440019', 'Holly', NULL, NULL, 'Flax', 'system', NOW()),
    ('550e8400-e29b-41d4-a716-446655440020', 'David', NULL, NULL, 'Wallace', 'system', NOW()),
    ('550e8400-e29b-41d4-a716-446655440021', 'Roy', NULL, NULL, 'Anderson', 'system', NOW()),
    ('550e8400-e29b-41d4-a716-446655440022', 'Gabe', NULL, NULL, 'Lewis', 'system', NOW()),
    ('550e8400-e29b-41d4-a716-446655440023', 'Nellie', NULL, NULL, 'Bertram', 'system', NOW())
on conflict do nothing;


-- Insert contact methods
INSERT INTO shared.contact_method (contact_method_guid, person_guid, contact_method_type, contact_value, create_user_id, create_utc_timestamp)
VALUES
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'PRIMPHONE', '570-555-0001', 'system', NOW()),
    ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'EMAILADDR', 'jim.halpert@dundermifflin.com', 'system', NOW()),
    ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'PRIMPHONE', '570-555-0003', 'system', NOW()),
    ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'EMAILADDR', 'dwight.schrute@dundermifflin.com', 'system', NOW()),
    ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'PRIMPHONE', '570-555-0005', 'system', NOW()),
    ('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', 'EMAILADDR', 'kevin.malone@dundermifflin.com', 'system', NOW()),
    ('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440007', 'PRIMPHONE', '570-555-0007', 'system', NOW()),
    ('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440008', 'EMAILADDR', 'stanley.hudson@dundermifflin.com', 'system', NOW()),
    ('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440009', 'PRIMPHONE', '570-555-0009', 'system', NOW()),
    ('660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440010', 'EMAILADDR', 'meredith.palmer@dundermifflin.com', 'system', NOW()),
    ('660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440011', 'PRIMPHONE', '570-555-0011', 'system', NOW()),
    ('660e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440012', 'EMAILADDR', 'kelly.kapoor@dundermifflin.com', 'system', NOW())
on conflict do nothing;

