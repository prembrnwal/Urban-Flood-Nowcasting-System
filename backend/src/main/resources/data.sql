-- ============================================================
-- URBAN FLOOD NOWCASTING SYSTEM - DEMO/SIMULATED DATA
-- Fictional "Navi Mumbai Sector Z" urban zone
-- All coordinates, elevations, and capacities are SIMULATED
-- ============================================================

-- ── Rainfall Forecast (0-180 minutes) ───────────────────────
INSERT INTO rainfall_forecast (forecast_minute, rainfall, uncertainty, forecast_type, created_at) VALUES
(0,   20.0,  3.0, 'NOWCAST',     NOW()),
(30,  42.0,  5.0, 'NOWCAST',     NOW()),
(60,  67.0,  8.0, 'SHORT_TERM',  NOW()),
(90,  74.0, 10.0, 'SHORT_TERM',  NOW()),
(120, 58.0, 12.0, 'MEDIUM_TERM', NOW()),
(150, 45.0, 15.0, 'MEDIUM_TERM', NOW()),
(180, 28.0, 18.0, 'MEDIUM_TERM', NOW());

-- ── Streets (40 entries) ─────────────────────────────────────
-- elevation (m), slope (deg), imperviousness (0-1), surface_area (m²), population
INSERT INTO street (name, latitude, longitude, elevation, slope, imperviousness, surface_area, zone, population, ward, geometry) VALUES
('MG Road',              19.0760, 72.8777, 18.4, 1.2, 0.91, 8500,  'COMMERCIAL', 1200, 'A', '{"type":"LineString","coordinates":[[72.877,19.076],[72.879,19.077]]}'),
('Station Road',         19.0720, 72.8820, 12.1, 0.8, 0.88, 9200,  'COMMERCIAL', 1500, 'A', '{"type":"LineString","coordinates":[[72.882,19.072],[72.884,19.073]]}'),
('Ring Road North',      19.0850, 72.8760, 22.3, 2.1, 0.75, 12000, 'ARTERIAL',    800, 'B', '{"type":"LineString","coordinates":[[72.876,19.085],[72.880,19.086]]}'),
('Sector 5 Main',        19.0700, 72.8810, 8.5,  0.4, 0.92, 7800,  'RESIDENTIAL', 2200, 'C', '{"type":"LineString","coordinates":[[72.881,19.070],[72.882,19.071]]}'),
('Low-lying Lane',       19.0680, 72.8790, 3.2,  0.2, 0.95, 5500,  'RESIDENTIAL', 1800, 'C', '{"type":"LineString","coordinates":[[72.879,19.068],[72.880,19.069]]}'),
('University Road',      19.0800, 72.8730, 25.7, 3.5, 0.70, 11000, 'EDUCATIONAL',  600, 'B', '{"type":"LineString","coordinates":[[72.873,19.080],[72.876,19.081]]}'),
('Market Street',        19.0730, 72.8800, 10.3, 0.6, 0.93, 6800,  'COMMERCIAL', 3000, 'A', '{"type":"LineString","coordinates":[[72.880,19.073],[72.881,19.074]]}'),
('Hospital Road',        19.0790, 72.8850, 15.8, 1.8, 0.82, 8000,  'MEDICAL',     500, 'B', '{"type":"LineString","coordinates":[[72.885,19.079],[72.886,19.080]]}'),
('Sector 12 Cross',      19.0710, 72.8770, 6.1,  0.3, 0.94, 7200,  'RESIDENTIAL', 2500, 'C', '{"type":"LineString","coordinates":[[72.877,19.071],[72.878,19.072]]}'),
('Flood Lane',           19.0690, 72.8760, 2.8,  0.1, 0.96, 5000,  'RESIDENTIAL', 1600, 'D', '{"type":"LineString","coordinates":[[72.876,19.069],[72.877,19.070]]}'),
('Nehru Nagar Road',     19.0740, 72.8840, 11.5, 0.7, 0.89, 8800,  'RESIDENTIAL', 2000, 'A', '{"type":"LineString","coordinates":[[72.884,19.074],[72.885,19.075]]}'),
('Gandhi Chowk',         19.0755, 72.8795, 14.2, 1.1, 0.91, 9500,  'COMMERCIAL', 2800, 'A', '{"type":"LineString","coordinates":[[72.8795,19.0755],[72.8810,19.0760]]}'),
('Industrial Zone Rd',   19.0820, 72.8900, 19.6, 2.4, 0.78, 13000, 'INDUSTRIAL',  400, 'E', '{"type":"LineString","coordinates":[[72.890,19.082],[72.892,19.083]]}'),
('Riverside Drive',      19.0660, 72.8750, 1.5,  0.1, 0.85, 6500,  'RESIDENTIAL', 1400, 'D', '{"type":"LineString","coordinates":[[72.875,19.066],[72.876,19.067]]}'),
('Sector 7 Road',        19.0770, 72.8810, 13.4, 0.9, 0.90, 7500,  'RESIDENTIAL', 1900, 'A', '{"type":"LineString","coordinates":[[72.881,19.077],[72.882,19.078]]}'),
('Metro Link Road',      19.0840, 72.8780, 20.1, 1.9, 0.77, 10500, 'TRANSIT',     700, 'B', '{"type":"LineString","coordinates":[[72.878,19.084],[72.879,19.085]]}'),
('Collector Road W',     19.0750, 72.8750, 16.3, 1.5, 0.83, 9800,  'ARTERIAL',   1100, 'B', '{"type":"LineString","coordinates":[[72.875,19.075],[72.876,19.076]]}'),
('Patel Nagar Lane',     19.0705, 72.8785, 7.2,  0.4, 0.93, 6200,  'RESIDENTIAL', 2300, 'C', '{"type":"LineString","coordinates":[[72.8785,19.0705],[72.8795,19.0710]]}'),
('Eastern Bypass',       19.0800, 72.8920, 23.8, 2.8, 0.72, 14000, 'ARTERIAL',    350, 'E', '{"type":"LineString","coordinates":[[72.892,19.080],[72.895,19.081]]}'),
('Valley Road',          19.0670, 72.8770, 4.6,  0.2, 0.94, 5800,  'RESIDENTIAL', 1700, 'D', '{"type":"LineString","coordinates":[[72.877,19.067],[72.878,19.068]]}'),
('Sector 9 Street',      19.0760, 72.8830, 12.8, 0.8, 0.91, 7000,  'RESIDENTIAL', 2100, 'A', '{"type":"LineString","coordinates":[[72.883,19.076],[72.884,19.077]]}'),
('Fire Station Road',    19.0780, 72.8870, 17.5, 1.6, 0.80, 8200,  'CIVIC',       600, 'B', '{"type":"LineString","coordinates":[[72.887,19.078],[72.888,19.079]]}'),
('Police Colony Rd',     19.0720, 72.8755, 9.4,  0.5, 0.92, 6800,  'CIVIC',       900, 'C', '{"type":"LineString","coordinates":[[72.7545,19.072],[72.756,19.073]]}'),
('School Zone Road',     19.0790, 72.8800, 16.0, 1.4, 0.79, 7800,  'EDUCATIONAL',  850, 'B', '{"type":"LineString","coordinates":[[72.880,19.079],[72.881,19.080]]}'),
('Drainage Axis Road',   19.0740, 72.8760, 5.3,  0.2, 0.95, 5500,  'RESIDENTIAL', 2000, 'D', '{"type":"LineString","coordinates":[[72.876,19.074],[72.877,19.075]]}'),
('Bridge View Road',     19.0665, 72.8780, 3.8,  0.2, 0.88, 6000,  'RESIDENTIAL', 1300, 'D', '{"type":"LineString","coordinates":[[72.878,19.0665],[72.879,19.0670]]}'),
('Collector Road E',     19.0760, 72.8870, 15.2, 1.3, 0.84, 9000,  'ARTERIAL',   1000, 'B', '{"type":"LineString","coordinates":[[72.887,19.076],[72.888,19.077]]}'),
('Commercial Hub Rd',    19.0745, 72.8820, 11.8, 0.7, 0.92, 8400,  'COMMERCIAL', 2600, 'A', '{"type":"LineString","coordinates":[[72.882,19.0745],[72.883,19.0750]]}'),
('Inner Ring Road',      19.0775, 72.8775, 14.7, 1.0, 0.85, 10200, 'ARTERIAL',   1050, 'B', '{"type":"LineString","coordinates":[[72.8775,19.0775],[72.8790,19.0780]]}'),
('Sector 3 Link',        19.0700, 72.8800, 7.8,  0.4, 0.93, 6500,  'RESIDENTIAL', 2400, 'C', '{"type":"LineString","coordinates":[[72.880,19.070],[72.881,19.071]]}'),
('Hilltop Road',         19.0870, 72.8750, 38.5, 5.2, 0.65, 7500,  'RESIDENTIAL',  400, 'B', '{"type":"LineString","coordinates":[[72.875,19.087],[72.876,19.088]]}'),
('North Sector Road',    19.0860, 72.8790, 28.3, 3.1, 0.73, 9000,  'RESIDENTIAL',  600, 'B', '{"type":"LineString","coordinates":[[72.879,19.086],[72.880,19.087]]}'),
('West Extension',       19.0740, 72.8720, 20.9, 2.3, 0.76, 10000, 'ARTERIAL',    750, 'B', '{"type":"LineString","coordinates":[[72.872,19.074],[72.873,19.075]]}'),
('Slum Area Road',       19.0695, 72.8795, 5.1,  0.3, 0.97, 4500,  'RESIDENTIAL', 3500, 'D', '{"type":"LineString","coordinates":[[72.8795,19.0695],[72.8800,19.0700]]}'),
('Transport Nagar Rd',   19.0715, 72.8835, 10.6, 0.6, 0.90, 8700,  'COMMERCIAL', 1800, 'A', '{"type":"LineString","coordinates":[[72.8835,19.0715],[72.8845,19.0720]]}'),
('City Hospital Rd',     19.0795, 72.8855, 16.4, 1.4, 0.81, 8100,  'MEDICAL',     450, 'B', '{"type":"LineString","coordinates":[[72.885,19.0795],[72.886,19.0800]]}'),
('Railway Station Rd',   19.0728, 72.8812, 11.2, 0.7, 0.89, 9300,  'TRANSIT',    2200, 'A', '{"type":"LineString","coordinates":[[72.881,19.0728],[72.882,19.0732]]}'),
('Sector 17 Main',       19.0810, 72.8760, 21.5, 2.0, 0.78, 10800, 'RESIDENTIAL',  900, 'B', '{"type":"LineString","coordinates":[[72.876,19.081],[72.877,19.082]]}'),
('Canal Bank Road',      19.0658, 72.8785, 2.1,  0.1, 0.86, 5200,  'RESIDENTIAL', 1200, 'D', '{"type":"LineString","coordinates":[[72.8785,19.0658],[72.8790,19.0662]]}'),
('Civic Center Rd',      19.0765, 72.8858, 15.6, 1.2, 0.83, 8600,  'CIVIC',       950, 'B', '{"type":"LineString","coordinates":[[72.885,19.076],[72.886,19.077]]}');

-- ── Drainage Nodes (20 entries) ──────────────────────────────
-- capacity in m³/s
INSERT INTO drainage_node (id, name, latitude, longitude, capacity, current_flow, blockage_percentage, invert, status, connected_streets, node_type) VALUES
('D-101', 'Node A1 - Ring Road Junction',    19.0855, 72.8760, 8.5,  2.1, 5.0,   15.2, 'NORMAL',    '3,16,37',   'JUNCTION'),
('D-102', 'Node A2 - University Inlet',      19.0800, 72.8740, 6.2,  1.8, 8.0,   18.5, 'NORMAL',    '6,17',      'INLET'),
('D-103', 'Node B1 - Inner Ring Junction',   19.0775, 72.8780, 7.8,  3.4, 12.0,  11.2, 'WARNING',   '29,17,15',  'JUNCTION'),
('D-104', 'Node B2 - MG Road Main',          19.0762, 72.8780, 7.2,  4.1, 20.0,  8.4,  'WARNING',   '1,12,29',   'MANHOLE'),
('D-105', 'Node C1 - Sector 5 Inlet',        19.0705, 72.8815, 5.5,  3.2, 15.0,  5.1,  'WARNING',   '4,18,30',   'INLET'),
('D-106', 'Node C2 - Market Junction',       19.0732, 72.8803, 6.0,  4.8, 25.0,  7.3,  'WARNING',   '7,12,28',   'JUNCTION'),
('D-107', 'Node D1 - Low Lying Collector',   19.0682, 72.8793, 4.2,  3.9, 30.0,  2.5,  'OVERLOADED','5,20,25',   'MANHOLE'),
('D-108', 'Node D2 - Flood Lane Outlet',     19.0692, 72.8763, 3.8,  3.6, 35.0,  1.8,  'OVERLOADED','10,25,26',  'MANHOLE'),
('D-109', 'Node D3 - Canal Bank Node',       19.0660, 72.8787, 3.5,  3.3, 40.0,  1.2,  'OVERLOADED','14,39',     'MANHOLE'),
('D-110', 'Node E1 - Riverside Outfall',     19.0655, 72.8775, 12.0, 5.2, 5.0,   0.5,  'NORMAL',    '14,26',     'OUTFALL'),
('D-111', 'Node A3 - Metro Link Node',       19.0842, 72.8782, 9.0,  2.5, 6.0,   17.8, 'NORMAL',    '16,32',     'JUNCTION'),
('D-112', 'Node B3 - Hospital Road Node',    19.0793, 72.8852, 5.5,  2.2, 10.0,  12.6, 'NORMAL',    '8,36,40',   'MANHOLE'),
('D-113', 'Node A4 - Commercial Hub',        19.0747, 72.8822, 6.8,  4.2, 22.0,  9.1,  'WARNING',   '28,35,37',  'JUNCTION'),
('D-114', 'Node C3 - Sector 9 Node',         19.0763, 72.8832, 5.8,  3.6, 18.0,  10.2, 'WARNING',   '21,27',     'MANHOLE'),
('D-115', 'Node E2 - Main Outfall South',    19.0645, 72.8790, 15.0, 6.1, 3.0,   0.2,  'NORMAL',    '39',        'OUTFALL'),
('D-116', 'Node D4 - Slum Area Collector',   19.0697, 72.8797, 3.2,  3.0, 45.0,  3.2,  'OVERLOADED','34,30',     'MANHOLE'),
('D-117', 'Node B4 - Station Road Node',     19.0723, 72.8823, 6.5,  3.8, 16.0,  8.8,  'WARNING',   '2,36,37',   'JUNCTION'),
('D-118', 'Node C4 - Police Colony Node',    19.0722, 72.8758, 5.0,  2.1, 10.0,  7.5,  'NORMAL',    '23,33',     'MANHOLE'),
('D-119', 'Node A5 - Industrial Zone Node',  19.0823, 72.8902, 10.5, 1.8, 4.0,   16.3, 'NORMAL',    '13,19',     'JUNCTION'),
('D-120', 'Node E3 - Eastern Outfall',       19.0815, 72.8940, 18.0, 3.2, 2.0,   0.8,  'NORMAL',    '19',        'OUTFALL');

-- ── Drainage Edges (25 pipes) ────────────────────────────────
-- capacity in m³/s, diameter in metres
INSERT INTO drainage_edge (source_node_id, destination_node_id, length, diameter, slope, capacity, pipe_type) VALUES
('D-101', 'D-103', 450.0,  0.90, 0.003, 8.0,  'CIRCULAR'),
('D-102', 'D-103', 380.0,  0.80, 0.004, 6.5,  'CIRCULAR'),
('D-103', 'D-104', 300.0,  0.90, 0.003, 7.5,  'CIRCULAR'),
('D-104', 'D-106', 250.0,  0.75, 0.002, 6.0,  'CIRCULAR'),
('D-105', 'D-106', 280.0,  0.70, 0.002, 5.5,  'CIRCULAR'),
('D-106', 'D-107', 320.0,  0.65, 0.001, 4.5,  'CIRCULAR'),
('D-107', 'D-108', 200.0,  0.60, 0.001, 4.0,  'CIRCULAR'),
('D-108', 'D-109', 280.0,  0.60, 0.001, 3.8,  'CIRCULAR'),
('D-109', 'D-110', 180.0,  0.80, 0.002, 6.0,  'CIRCULAR'),
('D-110', 'D-115', 350.0,  1.20, 0.003, 12.0, 'BOX'),
('D-111', 'D-103', 420.0,  0.85, 0.003, 7.5,  'CIRCULAR'),
('D-112', 'D-114', 260.0,  0.65, 0.002, 5.0,  'CIRCULAR'),
('D-113', 'D-106', 230.0,  0.70, 0.002, 5.5,  'CIRCULAR'),
('D-113', 'D-114', 200.0,  0.65, 0.002, 5.0,  'CIRCULAR'),
('D-114', 'D-107', 310.0,  0.60, 0.001, 4.5,  'CIRCULAR'),
('D-116', 'D-107', 180.0,  0.55, 0.001, 3.5,  'CIRCULAR'),
('D-117', 'D-106', 270.0,  0.70, 0.002, 5.5,  'CIRCULAR'),
('D-118', 'D-104', 330.0,  0.65, 0.002, 5.0,  'CIRCULAR'),
('D-119', 'D-120', 500.0,  1.00, 0.004, 9.0,  'CIRCULAR'),
('D-104', 'D-113', 220.0,  0.75, 0.002, 6.0,  'CIRCULAR'),
('D-112', 'D-113', 280.0,  0.65, 0.002, 5.2,  'CIRCULAR'),
('D-108', 'D-116', 150.0,  0.55, 0.001, 3.0,  'CIRCULAR'),
('D-105', 'D-116', 200.0,  0.55, 0.001, 3.2,  'CIRCULAR'),
('D-116', 'D-109', 250.0,  0.60, 0.001, 3.5,  'CIRCULAR'),
('D-111', 'D-112', 350.0,  0.70, 0.002, 5.5,  'CIRCULAR');

-- ── Critical Infrastructure & Safe Evacuation Points (13 locations) ─────────
INSERT INTO critical_infrastructure (name, type, latitude, longitude, address, capacity, current_risk_level, nearest_street_ids) VALUES
('City General Hospital',             'HOSPITAL',         19.0793, 72.8858, '45 Hospital Road, Sector B',   350, 'SAFE', '8,36'),
('Central Fire Station No.3',         'FIRE_STATION',     19.0782, 72.8868, '12 Fire Station Road, Sector B', 30,  'SAFE', '22'),
('Sector 7 Police Station',           'POLICE_STATION',   19.0720, 72.8757, '7 Police Colony Road, Ward C',   80,  'SAFE', '23'),
('Central Railway Station',           'RAILWAY_STATION',  19.0726, 72.8815, 'Station Road, Ward A',          NULL,'SAFE', '2,37'),
('Sector 12 Metro Station',           'METRO_STATION',    19.0843, 72.8779, 'Metro Link Road, Ward B',       NULL,'SAFE', '16,38'),
('Government Higher School',          'SCHOOL',           19.0788, 72.8803, '23 School Zone Road, Ward B',   1200,'SAFE', '24'),
('Sector 5 Flood Shelter',            'SHELTER',          19.0810, 72.8762, 'Sector 17 Main Road, Ward B',    800, 'SAFE', '38'),
('Community Health Center',           'HOSPITAL',         19.0710, 72.8808, 'Sector 5 Main Road, Ward C',     120, 'SAFE', '4,30'),
('Hilltop High-Ground Safe Haven',    'SAFE_POINT',       19.0872, 72.8748, 'Hilltop Ridge (Elev: 38.5m)',   2500,'SAFE', '50'),
('North Sector Evacuation Assembly',  'SAFE_POINT',       19.0862, 72.8792, 'North Sector Park (Elev: 28.3m)',1800,'SAFE', '51'),
('University Campus Relief Shelter',  'RELIEF_CAMP',      19.0802, 72.8728, 'University Grounds (Elev: 25.7m)',3000,'SAFE', '6'),
('Kohinoor Heights Emergency Zone',   'SAFE_POINT',       19.0825, 72.8895, 'Kohinoor Grounds (Elev: 19.6m)',2000,'SAFE', '32'),
('Vidyanagar High Ridge Refuge',     'RELIEF_CAMP',      19.0880, 72.8780, 'Vidyanagar High Ground',        1500,'SAFE', '51');
