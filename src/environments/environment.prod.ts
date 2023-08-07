export const environment = {
    production: true,
    ApiUrl: ' ',
  };
  export const URI_ENDPOINT = (term:string) => `${environment.ApiUrl}${term}`;
  
  export const URI_ENDPOINT_WITH_ID = (term:string,id: any) => `${environment.ApiUrl}${term}/${id}`;
  
  export const URI_ENDPOINT_WITH_PARAMS = (term:string,params: any[]) => `${environment.ApiUrl}${term}${convertParamsToUrlString(params)}`;
  export const URI_PARAM_APPENDER = (param: any) => `/${param}`;
  function convertParamsToUrlString(params:any[]):any{
    let str = '';
    params.forEach((param)=>
      str += URI_PARAM_APPENDER(param)
    )
    return str;
  }