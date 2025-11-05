import { SortDirection } from '../../Domain/Repositories/searchableRepositoryContracts'

export type SearchInput<Filter = string> = {
  page?: number
  perPage?: number
  sort?: string | null
  sortDir?: SortDirection | null
  filter?: Filter | null
}
