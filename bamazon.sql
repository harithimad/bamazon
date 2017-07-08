create database bamazon;
use  bamazon;
create table products(
item_id int(10) auto_increment not null,
product_name varchar(30) not null,
department_name varchar(30) not null ,
price decimal(10,2) not null,
stock_quantity int(10) not null ,
primary key (item_id)

);
insert into products(product_name,department_name,price,stock_quantity)
values ("Pizza","Frozen Food",5.99,10),
("Eggs","Breakfast",2.99,15),
("Monopoly","Games",19.99,20),
("IPHONE 7 ","Electronics",599.99,4),
("Pan","Kitchen supplies",20.00,15),
("Mini USB Vacuum Cleaner","office",19.99,15),
("Bacon Toothpaste","Personal Care",6.41,20),
("iPhone Stand","Accessories",17.08,100),
("Disco Ball Helmet","Auto",42.99,5),
("Horse Head Mask","Toys" , 23.07,12),
("Bicycle","Sports",100.99,20);
select * from products