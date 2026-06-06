import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesService {
    handleGamePlayRequest() {
        // if a game to match exists than get the id of it
        // change the status of game
        // emit jwt with game id and color to opponent
        // return observable with start from having jwt of current player color and game id

        // if game does not exist
        // choose a random color for current player and create entry of game
        // return observable
    }

    createGameAndReturnStream() {
        //
    }
}
