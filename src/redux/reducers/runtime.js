const SET_RUNTIME_VARIABLE = 'runtime/SET_RUNTIME_VARIABLE';

export default function runtime(state = {}, action) {
    switch (action.type) {
        case SET_RUNTIME_VARIABLE:
            return {
                ...state,
                [action.payload.name]: action.payload.value,
            };
        default:
            return state;
    }
}

export function setRuntimeVariable({ name, value }) {
    return {
        type: SET_RUNTIME_VARIABLE,
        payload: {
            name,
            value,
        },
    };
}
