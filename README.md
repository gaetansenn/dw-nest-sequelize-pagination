# dw-nest-sequelize-pagination
A pagination module for NestJS and Sequelize

## 🌐 Description

NestJS module to handle pagination with sequelize

## 📦 Integration

With our old friend `npm`

```
npm install -save dw-nest-sequelize-pagination
```

With yarn

```
yarn add dw-nest-sequelize-pagination
```

## ▶️ Getting started

First of all inject the module to your `AppModule`

```ts
import { Module } from '@nestjs/common';
import { PaginateModule } from 'nestjs-sequelize-paginate';

@Module({
   imports: [
      PaginateModule.forRoot({
         limit: 50
      }),
   ],
})
export class AppModule {}
```

The **forRoot()** method allow you to overide default configuration

| Name          | Description                                       | Type                      | Default    |
| ------------- | ------------------------------------------------- | ------------------------- | ---------- |
| limit         | If you want to change default limit value         | _number_                  | `30`            |
| offset        | If you want to change default offset value        | _number_                  | 
`0`             |

### Service

Sequelize service overide `findAll` method from Sequelize and allow you to handle pagination automaticaly.

```ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable } from 'sequelize/types';
import { PaginationService } from 'dw-nest-sequelize-pagination';

import {
  PaginationQuery,
  PaginationResponse,
} from 'src/pagination/pagination.entity';
import { Vehicle } from './vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    private paginationService: PaginationService,
  ) {}

  findAll(
    paginationOptions: PaginationQuery,
    include: Includeable | Includeable[] = [],
  ): Promise<PaginationResponse<Vehicle>> {
    return this.paginationService.findAll(
      {
        ...paginationOptions,
        model: Vehicle,
      },
      {
        include,
      },
    );
  }
}
```

Let's have a look to the controller part.

```ts
import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import {
  PaginationQuery,
  PaginationResponse,
} from 'src/pagination/pagination.entity';
import { Pagination } from 'src/pagination/pagination.decorator';
import { Section } from 'src/sections/sections.entity';
import { VehicleType } from './vehicle-type.entity';
import { Vehicle } from './vehicle.entity';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'Get vehicles' })
  getVehicles(
    @Pagination({
      limit: 50,
      offset: 1
    })
    pagination: PaginationQuery,
  ): Promise<PaginationResponse<Vehicle>> {
    return this.vehiclesService.findAll(pagination, [Section, VehicleType]);
  }
}
```

### Decorator 

As you can see here you can overide the default pagination `limit` and `offset` for this specific route. 
The `@Pagination` decorator also handle validation of `limit` and `offset` thanks to `ValidationPipe` feature from nestJS. By default Nestjs disable the Validation from custom decorator.

#### Global `ValidationPipe`

If you have activate the `ValidationPipe` globally you have to set `validateCustomDecorators` to `true`

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      validateCustomDecorators: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
```

#### To `@Pagination` decorator

```ts
import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import {
  PaginationQuery,
  PaginationResponse,
} from 'src/pagination/pagination.entity';
import { Pagination } from 'src/pagination/pagination.decorator';
import { Section } from 'src/sections/sections.entity';
import { VehicleType } from './vehicle-type.entity';
import { Vehicle } from './vehicle.entity';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'Get vehicles' })
  getVehicles(
    @Pagination(new ValidationPipe({ validateCustomDecorators: true }), {
      limit: 50,
      offset: 1
    })
    pagination: PaginationQuery,
  ): Promise<PaginationResponse<Vehicle>> {
    return this.vehiclesService.findAll(pagination, [Section, VehicleType]);
  }
}
```
