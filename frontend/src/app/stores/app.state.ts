 

export interface AppState {
  isLoading: boolean,
  pubKey: string | null,
  token: string | null, 
  resetResponse: RequestResponse,
  sideBar: boolean,  
};

export interface RequestResponse {
  isSuccess: boolean,
  isError: boolean,
  errorMessage: string | null,
}

export interface LoadingRequestResponse extends RequestResponse {
  isLoading: boolean
}
 
