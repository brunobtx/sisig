1)  criar pastas do projeto 
2) dentro das pastas execultar : 
 dependencias :
- yarn init -y 
- yarn add typescript -D
- yarn add express
- yarn add @types/express -D

inicir tsc 

- yarn tsc --init
 adicionar para rodar o projeto com comando
 - yarn add ts-node-dev -D
 adicionar  o script no packapage para usar dev para rodar o dervidor 
 -  "scripts": {
    "dev": "ts-node-dev src/server.ts"
  },
 
 Biblioteca de tratamento de Errors
  - yarn add express-async-errors

Biblioteca cors habilitar todas as solicitações
-  yarn add cors
- yarn add @types/cors -D 
biblioteca para BD
- yarn add prisma 
yarn add @prisma/client -D
npx prisma init

criar um migration 
- yarn prisma migrate dev 

adiconar biblioteca de encripitar senha : 
- yarn add bcryptjs 
-  yarn add @types/bcryptjs -D

adicionar bibliote jsonwebToken 
- yarn add jsonwebtoken
- yarn add @types/jsonwebtoken -D

adicionar dotenv 
- yarn add dotenv

adicionar biblioteca de imagens 
yarn add multer

yarn add @types/multer -D