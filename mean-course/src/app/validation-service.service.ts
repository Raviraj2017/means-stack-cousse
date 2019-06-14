import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService{

  constructor() { }

  checkSpecialCharacter(event)
{   
   var k;  
   k = event.charCode;  //         k = event.keyCode;  (Both can be used)
   return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
}
}
