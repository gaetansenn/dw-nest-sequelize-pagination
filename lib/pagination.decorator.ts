import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { loadPackage } from '@nestjs/common/utils/load-package.util';

// import { ApiQuery } from '@nestjs/swagger';

import { PaginationQuery } from './pagination.entity';

export const Pagination = createParamDecorator(
  (
    data: PaginationQuery | undefined,
    ctx: ExecutionContext,
  ): PaginationQuery => {
    const request = ctx.switchToHttp().getRequest();

    return {
      offset: request.query.offset
        ? parseInt(request.query.offset)
        : data?.offset || null,
      limit: request.query.limit
        ? parseInt(request.query.limit)
        : data?.limit || null,
    };
  },
  [
    (target: any, key: string) => {
      const Swagger = loadPackage('@nestjs/swagger', 'PaginationDecorator', () => require('@nestjs/swagger'))

      console.log('swagger is ', Swagger);
      if (Swagger) {
        Swagger.ApiQuery({
          name: 'offset',
          schema: {
            type: 'number',
            description: 'The offset / page to start pagination',
          },
          required: false,
        })(target, key, Object.getOwnPropertyDescriptor(target, key));
        Swagger.ApiQuery({
          name: 'limit',
          schema: {
            type: 'number',
            description: 'The limit, numbers of rows returnded',
          },
          required: false,
        })(target, key, Object.getOwnPropertyDescriptor(target, key));
      }
    },
  ],
);
