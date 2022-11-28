truncate table cart_items, carts

insert into carts (id) values 
('b1c15aae-ea55-46af-b409-6d47da53a9d9'),
('301260e4-b1cb-4512-a722-62c358751b54'),
('9bb8e23e-a064-4bf3-bc3f-6169c51161eb')

insert into  cart_items (cart_id, product_id, count) values 
('b1c15aae-ea55-46af-b409-6d47da53a9d9','7567ec4b-b10c-48c5-9345-fc73c48a80aa',2),
('b1c15aae-ea55-46af-b409-6d47da53a9d9','7567ec4b-b10c-48c5-9345-fc73c48a80a0',1),
('301260e4-b1cb-4512-a722-62c358751b54','7567ec4b-b10c-48c5-9345-fc73c48a80a2',4),
('9bb8e23e-a064-4bf3-bc3f-6169c51161eb','7567ec4b-b10c-48c5-9345-fc73c48a80a0',1),
('9bb8e23e-a064-4bf3-bc3f-6169c51161eb','7567ec4b-b10c-48c5-9345-fc73c48a80aa',2),
('9bb8e23e-a064-4bf3-bc3f-6169c51161eb','7567ec4b-b10c-48c5-9445-fc73c48a80a2',4)
