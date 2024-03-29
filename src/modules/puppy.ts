import { Action } from 'redux';
import { Puppy } from '../vm/vm';

enum PuppyActionTypes {
  SET_SIZE = 'SET_SIZE',
  SET_PUPPY = 'SET_PUPPY',
  SET_ISLIVE = 'SET_ISLIVE',
  SET_SHOWTLICON = 'SET_SHOWTLICON',
}

interface SetSizeAction extends Action {
  type: PuppyActionTypes.SET_SIZE;
  payload: {
    width: number;
    height: number;
  };
}

export const setSize = (width: number, height: number) => ({
  type: PuppyActionTypes.SET_SIZE,
  payload: {
    width,
    height,
  },
});

interface SetPuppyAction extends Action {
  type: PuppyActionTypes.SET_PUPPY;
  payload: {
    puppy: Puppy | null;
  };
}

export const setPuppy = (puppy: Puppy | null) => ({
  type: PuppyActionTypes.SET_PUPPY,
  payload: {
    puppy,
  },
});

interface SetIsLiveAction extends Action {
  type: PuppyActionTypes.SET_ISLIVE;
  payload: {
    isLive: boolean;
  };
}

export const setIsLive = (isLive: boolean) => ({
  type: PuppyActionTypes.SET_ISLIVE,
  payload: {
    isLive,
  },
});

interface SetShowTLIconAction extends Action {
  type: PuppyActionTypes.SET_SHOWTLICON;
  payload: {
    showTLIcon: boolean;
  };
}

export const setShowTLIcon = (showTLIcon: boolean) => ({
  type: PuppyActionTypes.SET_SHOWTLICON,
  payload: {
    showTLIcon,
  },
});

export type PuppyActions =
  | SetSizeAction
  | SetPuppyAction
  | SetIsLiveAction
  | SetShowTLIconAction;

export type PuppyState = {
  width: number;
  height: number;
  puppy: Puppy | null;
  isLive: boolean;
  showTLIcon: boolean;
};

const initialState: PuppyState = {
  width: 500,
  height: 500,
  puppy: null,
  isLive: true,
  showTLIcon: false,
};

export const puppyReducer = (state = initialState, action: PuppyActions) => {
  switch (action.type) {
    case PuppyActionTypes.SET_SIZE:
      if (state.puppy) {
        state.puppy.resize(action.payload.width, action.payload.height);
      }
      return {
        ...state,
        width: action.payload.width,
        height: action.payload.height,
      };
    case PuppyActionTypes.SET_PUPPY:
      return { ...state, puppy: action.payload.puppy };
    case PuppyActionTypes.SET_ISLIVE:
      return { ...state, isLive: action.payload.isLive };
    case PuppyActionTypes.SET_SHOWTLICON:
      return { ...state, showTLIcon: action.payload.showTLIcon };
    default:
      return state;
  }
};

export default puppyReducer;
