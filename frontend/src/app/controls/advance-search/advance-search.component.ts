import {
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter,
  Input,
  IterableDiffers,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { animate, style, transition, trigger } from "@angular/animations";
import { NgAsAdvancedSearchTerm, NgAsHeader, NgAsSearchTerm } from "./advance-search.model";

@Component({
  selector: 'adv-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.scss'],
  animations: [
    trigger(
      'inOutAnimModelabelAdv',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(40px)' }),
            animate(400,
              style({ opacity: 1, transform: 'translateY(0px)' }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1, transform: 'translateY(0px)' }),
            animate(400,
              style({ opacity: 0, transform: 'translateY(40px)' }))
          ]
        )
      ]
    ),
    trigger(
      'inOutAnimModelabelBas',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(-40px)' }),
            animate('0.4s ease-out',
              style({ opacity: 1, transform: 'translateY(0px)' }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1, transform: 'translateY(0px)' }),
            animate('0.4s ease-in',
              style({ opacity: 0, transform: 'translateY(-40px)' }))
          ]
        )
      ]
    ),
    trigger(
      'inOutAnimAdvsearch',
      [
        transition(
          ':enter',
          [
            style({ height: 0, opacity: 0 }),
            animate('0.4s ease-out',
              style({ height: "{{maxHeight}}px", opacity: 1 }))
          ],
          {
            params: { maxHeight: 0 }
          }
        ),
        transition(
          ':leave',
          [
            style({ height: "{{maxHeight}}px", opacity: 1 }),
            animate('0.4s ease-in',
              style({ height: 0, opacity: 0 }))
          ],
          {
            params: { maxHeight: 0 }
          }
        )
      ]
    )
  ]
})
export class AdvanceSearchComponent implements OnInit {

  constructor(
    private iterableDiffers: IterableDiffers,
    private cd: ChangeDetectorRef
  ) {
    // For array input difference handling
    this.iterableDiffer = iterableDiffers.find([]).create(undefined);
  }

  // ***********************************************************************************************************
  // Inputs and outputs
  // ***********************************************************************************************************

  /** Array of fields the user can set advance rules for */
  @Input() headers: NgAsHeader[] | null = null;
  /** Label for the basic search input field */
  @Input() simpleFieldLabel: string = 'Search items';
  /** What search term to have applied by default */
  @Input() defaultTerm: NgAsSearchTerm | null = null;
  /** Terms saved by the user previously */
  @Input() savedFilters: NgAsSearchTerm[] = [];

  /** The search term the user set up */
  @Output() selectedTerm = new EventEmitter<NgAsSearchTerm>();
  /** The inputArray with the selectedTerm applied */
  @Output() outputArray = new EventEmitter<any[]>();

  // ***********************************************************************************************************
  // User configured search term
  // ***********************************************************************************************************

  /** The terms the user configured */
  searchTerm: NgAsSearchTerm = {
    searchMode: 'simple',
    simpleSearchTerm: '',
    advancedSearchLink: 'and',
    advancedTerms: [{ id: 0, action: 1, actions: null, searchTerm: null }]
  };

  /** Counter that provides unique IDs for the advanced terms */
  advancedTermCounter = 1;

  actions = [
    { id: 1, name: 'containing' },
    { id: 2, name: 'equal to' },
    { id: 3, name: 'greater than' },
    { id: 4, name: 'less than' },
  ]

  // ***********************************************************************************************************
  // Animation helpers
  // ***********************************************************************************************************

  /** Component top-level DOM element */
  @ViewChild('container') container!: ElementRef<HTMLElement>;

  /** Current height of the advanced term rows */
  public get advancedFieldHeight(): number {
    if (this.container === undefined) {
      return 0;
    }

    let val = 0;

    // New term row, constant
    val += 45;

    // Calculate height advance terms
    //    If the container is wide, use one-row-per-term value,
    //    if it is narrow, use two-row-per-term value
    const advancedTermCount = this.searchTerm.advancedTerms.length;
    const containerWidth = this.container.nativeElement.offsetWidth;
    val += (advancedTermCount * (containerWidth > 749 ? 70 : 139));

    return val;
  }

  // ***********************************************************************************************************
  // Input handling
  // ***********************************************************************************************************

  ngOnInit(): void {
    // If no headers were proivded throw an error, since it is necessary for the advanced rule setup
    if (this.headers === null) {
      throw new Error("Input 'headers' is required");
    }

    // If a default term was provided apply it
    if (this.defaultTerm !== null) {
      this.searchTerm = this.defaultTerm;

      if (this.searchTerm.advancedTerms.length === 0) {
        this.searchTerm.advancedTerms.push({ id: 0, action: 1, actions: null, searchTerm: null });
      }
    }

    // Set output
    this.outputUpdate();
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  // ngDoCheck fails to detect array element changes by default. The following is a workaround
  iterableDiffer;

  ngDoCheck() {
    // let changes = this.iterableDiffer.diff(this.inputArray);
    // if (changes) {
    //   // Input array changed, update output
    //   this.outputUpdate();
    // }
  }

  // ***********************************************************************************************************
  // Output handling
  // ***********************************************************************************************************

  /**  */
  savedTermsChanged() {
    //this.savedFiltersChanged.emit(this.savedFilters);
  }

  /** Term or input changed, update output */
  outputUpdate() {
    this.selectedTerm.emit(this.searchTerm);
    this.updateOutputArray();
  }

  /** Apply the search terms to the inputArray, emit result */
  updateOutputArray() {
    // Call appropriate fitler function
    let results: any;
    if (this.searchTerm.searchMode === 'simple') {
      results = this.simpleFilter();
    } else {
      results = this.advancedFilter();
    }
    // Emit result
    this.outputArray.emit(results);
  }

  /** Apply simpleSearchTerm on every property of an item */
  simpleFilter(): any {
    return {
      mode: this.searchTerm.searchMode,
      link: this.searchTerm.advancedSearchLink,
      value: this.isNullOrEmpty(this.searchTerm.simpleSearchTerm) ? [] : [
        {
          id: 0,
          fieldName: 'default',
          action: 1,
          searchTerm: this.searchTerm.simpleSearchTerm
        }
      ]
    };
  }

  isNullOrEmpty(val: any | null): boolean {
    return val === undefined || val === null || val === '';
  }

  /** Apply the advancedTerms on the items */
  advancedFilter(): any {
    // Terms are invalid, return every item
    const nt = {
      mode: this.searchTerm.searchMode,
      link: this.searchTerm.advancedSearchLink,
      value: []
    }

    if (this.searchTerm.advancedTerms.every(t => t.action === undefined)) {
      return nt;
    }

    return {
      ...nt, value: [...this.searchTerm.advancedTerms].filter(x => x.fieldName !== undefined).map((x: any) => {
        return {
          id: x.id,
          fieldName: x.fieldName,
          action: x.action,
          searchTerm: x.searchTerm
        };
      })
    };
  }

  // ***********************************************************************************************************
  // Search term configuration
  // ***********************************************************************************************************

  /** Set the basic search term to empty */
  clearBasicTerm() {
    this.searchTerm.simpleSearchTerm = '';

    this.outputUpdate();
  }

  /** Toggle between basic and advanced search mode */
  toggleSearchMode() {
    if (this.searchTerm.searchMode === 'simple') {
      this.searchTerm.searchMode = 'advanced';
    } else {
      this.searchTerm.searchMode = 'simple';
    }

    this.outputUpdate();
  }

  /** Toggle the link between advanced terms (AND/OR) */
  toggleAdvancedLink() {
    if (this.searchTerm.advancedSearchLink === 'and') {
      this.searchTerm.advancedSearchLink = 'or';
    } else {
      this.searchTerm.advancedSearchLink = 'and';
    }

    this.outputUpdate();
  }

  /** Negate an advanced search term */
  termNegate(term: NgAsAdvancedSearchTerm) {
    term.isNegated = !term.isNegated;

    this.outputUpdate();
  }

  /** Add a new advanced search term */
  addTermRow() {
    this.searchTerm.advancedTerms.push({ id: this.advancedTermCounter, action: 1, actions: null, searchTerm: null });
    this.advancedTermCounter++;

    this.outputUpdate();
  }

  /** Delete an advance search term */
  delTermRow(termId: number) {
    this.searchTerm.advancedTerms = this.searchTerm.advancedTerms.filter(t => t.id !== termId);
    if (this.searchTerm.advancedTerms.length === 0) {
      this.searchTerm.advancedTerms.push({ id: 0, action: 1, actions: null, searchTerm: null });
    }

    this.outputUpdate();
  }

  /** An advanced search terms column was changed */
  updateTermField(term: NgAsAdvancedSearchTerm) {
    // Populate term type based on header type
    const header = this.headers?.find(h => h.id === term.fieldName);

    if (header?.type !== undefined) {
      term.fieldType = header.type;

      if (term.fieldType === 'lookup' || term.fieldType === 'boolean') {
        term.list = header.list;
        term.actions = [this.actions[1]];
        term.action = 2;
      } else if (term.fieldType === 'date') {
        term.actions = [this.actions[1], this.actions[2], this.actions[3]];
        term.action = 2;
      }
    } else {
      term.fieldType = 'string';
      term.actions = null;
    }

    //clear the search term
    if (term.fieldType === 'boolean') {
      term.searchTerm = false;
    } else
      term.searchTerm = null;

    this.outputUpdate();
  }

  // ***********************************************************************************************************
  // Filter saving
  // ***********************************************************************************************************

  loadedFilterName: string | null = null;
  loadedFilter: NgAsSearchTerm | null = null;

  public get loadedFilterChanged(): boolean {
    return !this.areTermsEqual(this.loadedFilter, this.searchTerm);
  }

  termLoaded(name: string | null) {
    this.loadedFilterName = name;
    this.loadedFilter = this.savedFilters.find(f => f.name === this.loadedFilterName) || null;
    this.searchTerm = {
      simpleSearchTerm: this.loadedFilter?.simpleSearchTerm,
      searchMode: this.loadedFilter?.searchMode,
      advancedSearchLink: this.loadedFilter?.advancedSearchLink,
      advancedTerms: this.loadedFilter?.advancedTerms.map(t => ({
        id: t.id,
        fieldName: t.fieldName,
        isNegated: t.isNegated,
        action: t.action,
        searchTerm: t.searchTerm,
        list: t.list
      } as NgAsAdvancedSearchTerm))
    } as NgAsSearchTerm;

    this.outputUpdate();
  }

  termSaved(data: { name: string, isDefault: boolean }) {
    if (data.isDefault === true) {
      this.savedFilters.filter(f => f.isDefault === true).forEach(f => f.isDefault = false);
      this.searchTerm.isDefault = true;
    }

    let existingTerm = this.savedFilters.find(f => f.name === data.name);

    if (existingTerm === undefined) {
      existingTerm = {} as NgAsSearchTerm;
      existingTerm.name = data.name
      this.savedFilters.push(existingTerm);
    }

    existingTerm.simpleSearchTerm = this.searchTerm.simpleSearchTerm;
    existingTerm.searchMode = this.searchTerm.searchMode;
    existingTerm.advancedSearchLink = this.searchTerm.advancedSearchLink;
    existingTerm.advancedTerms = this.searchTerm.advancedTerms.map(t => t);
    existingTerm.isDefault = data.isDefault;

    this.savedTermsChanged();
    this.termLoaded(data.name);
  }

  termDeleted(name: string) {
    this.savedFilters = this.savedFilters.filter(f => f.name !== name);
    if (this.loadedFilterName === name) {
      this.loadedFilterName = null;
      this.loadedFilter = null;
    }

    this.savedTermsChanged();
  }

  areTermsEqual(a: NgAsSearchTerm | null, b: NgAsSearchTerm | null): boolean {
    if (a === null && b !== null) {
      return false;
    }
    if (a !== null && b === null) {
      return false;
    }
    if (a === null && b === null) {
      return true;
    }

    if (a?.simpleSearchTerm !== b?.simpleSearchTerm) {
      return false;
    }
    if (a?.searchMode !== b?.searchMode) {
      return false;
    }
    if (a?.advancedSearchLink !== b?.advancedSearchLink) {
      return false;
    }
    if (a?.advancedTerms.length !== b?.advancedTerms.length) {
      return false;
    }
    return a?.advancedTerms.every((termA, index) => {
      const termB = b?.advancedTerms[index];
      if (termA.id !== termB?.id) {
        return false;
      }
      if (termA.fieldName !== termB.fieldName) {
        return false;
      }
      if (termA.isNegated !== termB.isNegated) {
        return false;
      }
      if (termA.action !== termB.action) {
        return false;
      }
      if (termA.searchTerm !== termB.searchTerm) {
        return false;
      }
      return true;
    }) || false;
  }

  termLookupUpdate(term: NgAsAdvancedSearchTerm, evt: any) {

    if (term.fieldType == 'boolean')
      term.searchTerm = evt.currentValue;
    else
      term.searchTerm = evt;
      
    this.outputUpdate();
  }
}
