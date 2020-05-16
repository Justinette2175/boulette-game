import ReduxStore from "../../redux/store";
import { updateTimer, resetTimer } from "../../redux/computer";
import moment from "moment";
import { Time } from "../../types";

const COUNTDOWN_INTERVAL = 1000;

class Countdown {
  endTime: string;
  interval: any;
  onEnd: () => void;

  constructor(endTime: string, onCountdownEnd: () => void) {
    this.endTime = endTime;
    this.onEnd = onCountdownEnd;
    this.start();
  }

  start = () => {
    this.interval = setInterval(() => {
      const callback = async () => {
        if (this._isFinished()) {
          this.onEnd();
          // this.reset();
        } else {
          this._updateLocally();
        }
      };
      callback();
    }, COUNTDOWN_INTERVAL);
  };

  _updateLocally = () => {
    const differenceInMilliseconds = moment().diff(moment(this.endTime));
    let seconds = -moment.duration(differenceInMilliseconds).seconds();
    let milliseconds = moment.duration(differenceInMilliseconds).milliseconds();
    let minutes = -moment.duration(differenceInMilliseconds).minutes();
    if (seconds < -1 || milliseconds > 0) {
      seconds = -1;
    }
    if (minutes < 0 || minutes === -0) {
      minutes = 0;
    }
    ReduxStore.dispatch(updateTimer({ seconds, minutes }));
  };

  _isFinished = (): boolean => {
    const differenceInMilliseconds = moment().diff(moment(this.endTime));
    const milliseconds = moment
      .duration(differenceInMilliseconds)
      .asMilliseconds();
    console.log("milliseconds", milliseconds);
    return milliseconds > 0;
  };

  reset = (remainingTimeForNextRound?: Time) => {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (remainingTimeForNextRound) {
      ReduxStore.dispatch(updateTimer(remainingTimeForNextRound));
    } else {
      ReduxStore.dispatch(resetTimer());
    }
  };
}

export default Countdown;
