CREATE TABLE car (
    car_id BIGINT PRIMARY KEY,
    car_weight BIGINT,
    car_length BIGINT
);

CREATE TABLE sensor (
    sensor_id BIGINT PRIMARY KEY,
    car_id BIGINT,
    type LINESTRING,
    foreign key (car_id) references car(car_id)
);

CREATE TABLE leitura (
    leitura_id BIGINT PRIMARY KEY,
    sensor_id BIGINT,
    circuito_id BIGINT,
    instant_speed BIGINT,
    instant_acceleration BIGINT,
    energy_consumed BIGINT,
    travelled_distance BIGINT,
    travel_time TIME
);

CREATE TABLE circuito (
    circuito_id BIGINT PRIMARY KEY,
    car_id BIGINT,
    leitura_id BIGINT,
    length_circuito BIGINT,
    foreign key (car_id) references car(car_id),
    foreign key (leitura_id) references leitura(leitura_id)
);