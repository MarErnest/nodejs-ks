import { ApiResponse } from '../dtos/api-response.dtos';

export class UnauthorizedRequestError extends Error {
  public response: ApiResponse<any>;
  constructor(response: any) {
    super();
    this.response = response;
  }
}
