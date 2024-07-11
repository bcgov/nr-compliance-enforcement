-- datafix scripts for Jira Tickets COMPENF-255 and COMPENF-256

update geo_organization_unit_code 
set short_description  = 'Lillooet', long_description = 'Lillooet'
where short_description  = 'Lilloet' and long_description  = 'Lilloet';

update geo_organization_unit_code 
set short_description  = 'Kootenay', long_description = 'Kootenay'
where short_description  = 'Kootney' and long_description  = 'Kootney';

update geo_organization_unit_code 
set short_description  = 'Columbia/Kootenay', long_description = 'Columbia/Kootenay'
where short_description  = 'Columbia/Kootney' and long_description  = 'Columbia/Kootney';

update geo_organization_unit_code 
set short_description  = 'East Kootenay', long_description = 'East Kootenay'
where short_description  = 'East Kootney' and long_description  = 'East Kootney';

update geo_organization_unit_code 
set short_description  = 'West Kootenay', long_description = 'West Kootenay'
where short_description  = 'West Kootney' and long_description  = 'West Kootney';