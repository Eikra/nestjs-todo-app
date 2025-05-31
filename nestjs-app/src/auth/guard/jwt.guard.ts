// import { AuthGuard } from "@nestjs/passport";

// class JwtGuard extends AuthGuard("jwt") {

//     constructor() {
//         super();
//         this.handleRequest = this.handleRequest.bind(this);
//     }
//     handleRequest(err: any, user: any, info: any) {

//         if (err || !user) {
//             throw err || new Error("Unauthorized");
//         }
//         return user;
//     }
// }
// export default JwtGuard;


import { AuthGuard } from '@nestjs/passport';
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable() // <-- Required for NestJS to inject this properly
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('Token has expired');
    }

    if (err || !user) {
      throw err || new UnauthorizedException('Unauthorized');
    }

    return user;
  }
}
