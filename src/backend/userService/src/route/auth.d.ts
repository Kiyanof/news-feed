declare module 'auth' {
    import { Router } from "express";
    import { RequestHandler } from 'express-serve-static-core';
  
    const router: Router;
  
    const changeSubscription: RequestHandler;
    const login: RequestHandler;
    const logout: RequestHandler;
    const signup: RequestHandler;
    const whoIsMe: RequestHandler;
  
    const logRequests: RequestHandler;
    const authenticate: RequestHandler;
  
    const changeSubscriptionValidation: RequestHandler;
    const isUserExist: RequestHandler;
    const signinValidation: RequestHandler;
    const signupValidation: RequestHandler;
  
    export default router;
  }