create table "user" (
    user_id serial primary key not null,
    user_name varchar(50) not null unique,
    master_pass varchar(255) not null,
    email varchar(100) not null unique,
    key_id int not null,
    constraint fk_key_id
        foreign key (key_id) references "key"(key_id),
    constraint unique_user_name unique(user_name)
);
create table "key" (
    key_id int primary key,
    public_key varchar,
    private_key varchar
);
create table password_container (
    pass_id serial primary key,
    owner_id int not null,
    pass varchar not null,
    name varchar not null,
    web_url varchar,
    description text,
    constraint fk_owner_id
        foreign key (owner_id) references "user"(user_id)
);
create table shared_pass_relation(
    pass_id int,
    user_id int,
    constraint fk_pass_id
        foreign key (pass_id) references "password_container"(pass_id),
    constraint fk_user_id
        foreign key (user_id) references "user"(user_id)
);