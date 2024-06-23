CREATE TABLE circuito (
    circuito_id INTEGER PRIMARY KEY AUTOINCREMENT,
    instant_speed BIGINT,
    instant_acceleration BIGINT,
    energy_consumed BIGINT,
    travelled_distance BIGINT,
    travel_time TIME
);