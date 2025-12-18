/** @format */

// import { makeAutoObservable, autorun } from "mobx";
import UserState from './UserState';
import SocketState from './SocketState';
import UiState from './UiState';
// import UIState from "./UIState";
// import UserState from "./UserState";

// ADD ENTRY OF YOUR STATE HERE
class RootState {
    UserState: UserState;
    SocketState: SocketState;
    UiState: UiState;

    constructor() {
        this.UiState = new UiState();
        // Create an instance of SocketState first
        this.SocketState = new SocketState(null, this.UiState); // Initially pass null or undefined

        // Pass the SocketState instance to UserState
        this.UserState = new UserState(this.SocketState);

        // Then update SocketState with the UserState reference
        this.SocketState.UserState = this.UserState; // Now SocketState has access to UserState
    }
}

export default RootState;

