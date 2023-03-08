import { Injectable } from '@angular/core';
import { StateTesting } from 'src/app/models/common/state-testing';

@Injectable({
  providedIn: 'root'
})
export class CurrentStateTestingService {

  constructor() { }

  ClearCurrentStateTesting() : void{
    sessionStorage.setItem("StateTesting",StateTesting.Menu.toString());
  }

  GetCurrentStateTesting() : StateTesting{
    const state = (sessionStorage.getItem("StateTesting") || StateTesting.Menu ) as StateTesting;
    return state
  }

  SetCurrentStateTesting(state:StateTesting) : void{
    sessionStorage.setItem("StateTesting",state.toString());
  }
}
