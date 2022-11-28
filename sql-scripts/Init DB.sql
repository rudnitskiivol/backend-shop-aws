create extension if not exists "uuid-ossp";

drop table cart_items, carts

create table carts (
  id uuid primary key default uuid_generate_v4(),
  created_at date default current_date,
  updated_at date default current_date  	
);

create table cart_items (
  cart_id uuid,
  product_id uuid,
  count integer,
  foreign key ("cart_id") references "carts" ("id")
);


