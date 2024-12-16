# ecommerce-microservices-nestjs

## Architecture Overview:
- we have 4 microservice (products, orders, categories and users)
- each one has it's own database
- communication is done through RabbitMQ
  
![micro-arch](https://github.com/user-attachments/assets/b694f25b-a5c6-49cb-af73-c2216cb26109)

## Event-Based Communication Style Examples:

### From [Orders] Service to [Products] Service:
- Create Order => Decrements the stock count for each product in the order.
- Cancel Order => Restores the stock for products in the canceled order.

### From [Category] Service to [Product] Service:
- Update Catgeory Name => update catgeory field name in product micorservice for each product belong to this category.

## How to run:
1. `npm i`
2. Run databases and RabbitMQ: `docker-compose up -d` (make sure Docker is installed)
3. to run each microservice: `npm run start:dev [App Name]`
   - [App Name] represent each folder in `Apps` folder
   - for example to run the order micorservies: `npm run start:dev orders`
