import { Injectable, Logger } from "@nestjs/common";
import { Mapper } from "@automapper/core";

export interface PaginationParameters {
  page?: number;
  pageSize?: number;
}

export interface PaginationMetadata {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pageInfo: PaginationMetadata;
}

export interface PaginationOptions<TSource, TDestination> {
  prismaService: any;
  modelName: string;
  sourceTypeName: string;
  destinationTypeName: string;
  mapper: Mapper;
  whereClause: any;
  includeClause?: any;
  orderByClause?: any;
}

@Injectable()
export class PaginationUtility {
  private readonly logger = new Logger(PaginationUtility.name);

  private validatePaginationParams(
    page: number = 1,
    pageSize: number = 25,
  ): { page: number; pageSize: number; skip: number } {
    // Constrain input parameters
    const validatedPage = Math.max(1, page);
    const validatedPageSize = Math.min(Math.max(1, pageSize), 100); // Limit max page size to 100
    const skip = (validatedPage - 1) * validatedPageSize;

    return {
      page: validatedPage,
      pageSize: validatedPageSize,
      skip,
    };
  }

  private getPageInfo(totalCount: number, page: number, pageSize: number): PaginationMetadata {
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      hasNextPage,
      hasPreviousPage,
      totalCount,
      totalPages,
      currentPage: page,
      pageSize: pageSize,
    };
  }

  async paginate<TSource, TDestination>(
    paginationParams: PaginationParameters,
    options: PaginationOptions<TSource, TDestination>,
  ): Promise<PaginatedResult<TDestination>> {
    const { page, pageSize, skip } = this.validatePaginationParams(paginationParams.page, paginationParams.pageSize);

    const {
      prismaService,
      modelName,
      whereClause,
      includeClause,
      orderByClause,
      mapper,
      sourceTypeName,
      destinationTypeName,
    } = options;

    try {
      const model = prismaService[modelName];
      if (!model) {
        throw new Error(`Model ${modelName} not found in Prisma service`);
      }

      const totalCount = await model.count({ where: whereClause });

      const findManyOptions: any = {
        where: whereClause,
        skip,
        take: pageSize,
      };

      if (includeClause) {
        findManyOptions.include = includeClause;
      }

      if (orderByClause) {
        findManyOptions.orderBy = orderByClause;
      }

      const sourceData = await model.findMany(findManyOptions);

      const items = mapper.mapArray<TSource, TDestination>(
        sourceData as Array<TSource>,
        sourceTypeName,
        destinationTypeName,
      );

      const pageInfo = this.getPageInfo(totalCount, page, pageSize);

      return {
        items,
        pageInfo,
      };
    } catch (error) {
      this.logger.error(`Error in pagination for model ${modelName}:`, error);
      throw error;
    }
  }
}
