import { Injectable } from "@angular/core";
import { Action, NgxsOnInit, State, StateContext } from "@ngxs/store";
import { Mode } from "../modules/testing/testing";
// import { GetMode, SetMode, StateModeActions } from "./state-mode.actions";
// import { IStateModeModel } from "./state-mode.model";


// @State<IStateModeModel>({
//     name: 'State',
//     defaults: {
//         mode : Mode.Menu
//     }
// })

// @Injectable()
// export class StateMode implements NgxsOnInit{
//     constructor() {}

//     ngxsOnInit(ctx:any) {
//         ctx.dispatch(new GetMode());
//     }

//     @Action(SetMode)
//         setMode(ctx: StateContext<IStateModeModel>,action: SetMode){
//             const state = ctx.getState();
//             ctx.setState({
//                 ...state,
//                 mode : action.mode
//             })
//         }
// }