import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { getModelToken } from '@nestjs/sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';
import { FindAndCountOptions } from 'sequelize/types';

import { PAGINATION_OPTIONS } from './pagination.constant';

import {
  PaginationOption,
  PaginationQuery,
  PaginationResponse,
} from './pagination.entity';

@Injectable()
export class PaginationService {
  constructor(
    private moduleRef: ModuleRef,
    @Inject(PAGINATION_OPTIONS)
    private defaultOptions: PaginationQuery,
  ) {}

  async findAll(
    options: PaginationOption,
    optionsSequelize: FindAndCountOptions,
  ): Promise<PaginationResponse<any>> {
    const repository: ModelCtor<Model<any, any>> = this.moduleRef.get(
      getModelToken(options.model),
      {
        strict: false,
      },
    );

    options.limit = options.limit || this.defaultOptions.limit;
    options.offset = options.offset || this.defaultOptions.offset;

    const response = await repository.findAndCountAll({
      ...options,
      ...optionsSequelize,
    });

    return {
      data: response.rows,
      totalItems: response.count,
      totalPages: Math.ceil(response.count / options.limit),
      limit: options.limit,
      offset: options.offset,
    };
  }
}
