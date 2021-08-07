import { IsNumber, IsOptional } from 'class-validator';
import { Model, ModelCtor } from 'sequelize-typescript';

export class PaginationQuery {
  @IsOptional()
  @IsNumber()
  offset?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}

export interface PaginationOption extends PaginationQuery {
  model: ModelCtor<Model<any, any>>;
}

export interface PaginationResponse<T> extends PaginationQuery {
  data: T[];
  totalItems: number;
  totalPages: number;
}
