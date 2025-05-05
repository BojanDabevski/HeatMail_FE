import { inject, Injectable, Inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  
  
  if (isPlatformBrowser(platformId)) {
    const localData = localStorage.getItem("angularLogin");
    if (localData !== null) {

      //proveri dali e viable tokenot ushte
      return true;
    } else {
      router.navigateByUrl("homepage");
      return false;
    }
  } else {
    console.warn('localStorage is not available in this environment.');
    router.navigateByUrl("login");
    return false;
  }
};
