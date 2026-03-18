import {
  AuditLogRepository,
  ListAuditLogsFilters,
} from '../../../../../shared/audit';
import {
  AuditLogOutputMapper,
  ListAuditLogsOutputDto,
} from '../dtos/audit-log-output.dto';

export class ListAuditLogsUseCase {
  constructor(private readonly repository: AuditLogRepository) {}

  async execute(filters: ListAuditLogsFilters): Promise<ListAuditLogsOutputDto> {
    const result = await this.repository.list(filters);

    return {
      items: result.items.map((item) => AuditLogOutputMapper.toOutput(item)),
      pagination: {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: Math.max(Math.ceil(result.total / result.pageSize), 1),
      },
    };
  }
}
