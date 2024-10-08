export interface NgAsSearchTerm {
  searchMode: 'simple' | 'advanced';

  simpleSearchTerm: string;

  advancedSearchLink: 'and' | 'or';
  advancedTerms: NgAsAdvancedSearchTerm[];

  name?: string;
  isDefault?: boolean;
}

export interface NgAsAdvancedSearchTerm {
  id: number;
  fieldName?: string;
  fieldType?: 'string' | 'number' | 'date' | 'lookup' | 'boolean';
  actions: Array<any> | null,
  action: number;
  searchTerm: any | null;
  isNegated?: boolean;
  list?: Array<any>;
}

export interface NgAsHeader {
  id: string;
  displayText: string;
  type?: 'string' | 'number' | 'date' | 'lookup' | 'boolean';
  list?: Array<any>;
}

