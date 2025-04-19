create table "user" (
    id serial primary key,
    username varchar(50) not null,
    password varchar(255) not null,
    email varchar(100) not null
);