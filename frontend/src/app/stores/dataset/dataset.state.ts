
export interface DataState {
  dataList: DataList,
  dataInfo: DataInfo,
  dataLookUp: Array<DataLookUp>,
  actionCounter: number,
  error: string | null
}

export interface DataList {
  data: ReadonlyArray<any>,
  count: number
}

export interface DataInfo {
  id: number,
  data: any | null
}

export interface DataLookUp {
  name: string,
  data: Array<any>
}

