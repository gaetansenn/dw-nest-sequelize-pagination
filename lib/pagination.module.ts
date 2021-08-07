import { Global, Module } from '@nestjs/common';

import {
  PAGINATION_OPTIONS,
  DEFAULT_OFFSET,
  DEFAULT_LIMIT,
} from './pagination.constant';
import { PaginationQuery } from './pagination.entity';
import { PaginationService } from './pagination.service';

@Global()
@Module({
  providers: [PaginationService],
  exports: [PaginationService],
})
export class PaginationModule {
  static forRoot(
    options: PaginationQuery = { limit: DEFAULT_LIMIT, offset: DEFAULT_OFFSET },
  ) {
    return {
      module: PaginationModule,
      providers: [
        {
          provide: PAGINATION_OPTIONS,
          useValue: options,
        },
        PaginationService,
      ],
      exports: [PaginationService],
    };
  }
}
