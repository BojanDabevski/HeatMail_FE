import { inject, Injectable, Inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  
  // Check if the code is running in a browser environment
  if (isPlatformBrowser(platformId)) {
    const localData = localStorage.getItem("angularLogin");
    if (localData !== null) {
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
