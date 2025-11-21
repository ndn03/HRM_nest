import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Injectable decorator allows the ResponseI18nInterceptor to be injected into other services/controllers
@Injectable()
export class ResponseI18nInterceptor implements NestInterceptor {
  constructor(private readonly i18n: I18nService) {} // Inject the I18nService to translate messages

  // The 'intercept' method is called whenever a response is being handled.
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // The next.handle() function returns the observable for the request handler's response.
    // We use .pipe() to manipulate the observable before it reaches the client.
    return next.handle().pipe(
      map((data) => {
        const statusCode = context.switchToHttp().getResponse().statusCode; // Status code from the HTTP response
        let message = data?.message || `http.${statusCode}`; // Default message from the response data
        if (message) {
          // Extract the 'lang' header from the request to determine the language
          const lang = context.switchToHttp().getRequest().headers.lang;
          try {
            message = this.i18n.translate(message, { lang }); // Translate the message using the I18nService
          } catch (error) {
            message = error.message;
          }
        }

        // Returning the custom response format
        return {
          statusCode: context.switchToHttp().getResponse().statusCode, // Status code from the HTTP response
          ...data, // Spread operator to include the rest of the response data
          message, // Optional message property, taken from the response data if available
        };
      }),
    );
  }
}
