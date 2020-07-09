import { Reducer } from 'redux'
import { isUndefined } from 'tsfn'
import { TMetaState } from './types'
import { SET_COMPONENT_KEY_ACTION, SET_COMPONENTS_LIST_ACTION, SET_IMPORTED_META_ACTION, SET_PROPS_ACTION, RESET_COMPONENT_KEY_ACTION, TAllActions, SELECT_ELEMENT_ACTION } from './actions'
import { initialState } from './initial-state'

export const reducer: Reducer<TMetaState, TAllActions> = (state, action) => {
  if (isUndefined(state)) {
    return initialState
  }

  switch (action.type) {
    case SET_COMPONENTS_LIST_ACTION: {
      const { components } = action.payload

      return {
        ...initialState,
        components,
      }
    }

    case SET_COMPONENT_KEY_ACTION: {
      const { componentKey, propsIndex } = action.payload

      return {
        ...initialState,
        componentKey,
        propsIndex,
      }
    }

    case RESET_COMPONENT_KEY_ACTION: {
      return {
        ...initialState,
        components: state.components,
      }
    }

    case SELECT_ELEMENT_ACTION: {
      const { selectedElementPath } = action.payload

      return {
        ...state,
        selectedElementPath,
      }
    }

    case SET_IMPORTED_META_ACTION: {
      const {
        Component,
        componentConfig,
        componentKey,
        componentProps,
        componentPropsChildrenMap,
        components: components,
        packageJson,
        propsIndex,
        selectedElementPath,
      } = action.payload

      return {
        Component,
        componentConfig,
        componentKey,
        componentProps,
        componentPropsChildrenMap,
        components,
        packageJson,
        propsIndex,
        selectedElementPath,
      }
    }

    case SET_PROPS_ACTION: {
      const {
        componentKey,
        componentProps,
        componentPropsChildrenMap,
        propsIndex,
      } = action.payload

      return {
        ...state,
        componentKey,
        componentProps,
        componentPropsChildrenMap,
        propsIndex,
      }
    }

    default: {
      return state
    }
  }
}
