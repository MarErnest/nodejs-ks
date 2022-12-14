export class ApiResponse<T> {
  message?: string;
  status: boolean;
  data?: T;
  validationErrors?: any;
}
