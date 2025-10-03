import * as React from "react";

let count = 0;

function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}

const toastTimeouts = new Map();

const listeners = [];
let memoryState = { toasts: [] };

// ---------------- Dispatch ----------------
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => listener(memoryState));
}

// ---------------- Reducer ----------------
function reducer(state, action) {
    switch (action.type) {
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, 1), // max 1 toast at a time
            };

        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === action.toast.id ? { ...t, ...action.toast } : t
                ),
            };

        case "DISMISS_TOAST": {
            const { toastId } = action;

            if (toastId) {
                addToRemoveQueue(toastId);
            } else {
                state.toasts.forEach((toast) => addToRemoveQueue(toast.id));
            }

            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === toastId || toastId === undefined
                        ? { ...t, open: false }
                        : t
                ),
            };
        }

        case "REMOVE_TOAST":
            if (action.toastId === undefined) return { ...state, toasts: [] };
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.toastId),
            };

        default:
            return state;
    }
}

// ---------------- Helper to remove toast after timeout ----------------
function addToRemoveQueue(toastId) {
    if (toastTimeouts.has(toastId)) return;

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId);
        dispatch({ type: "REMOVE_TOAST", toastId });
    }, 1000);

    toastTimeouts.set(toastId, timeout);
}

// ---------------- Toast API ----------------
function toast(props) {
    const id = genId();

    const update = (updateProps) =>
        dispatch({ type: "UPDATE_TOAST", toast: { ...updateProps, id } });

    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open) => {
                if (!open) dismiss();
            },
        },
    });

    return { id, dismiss, update };
}

// ---------------- React hook ----------------
function useToast() {
    const [state, setState] = React.useState(memoryState);

    React.useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1) listeners.splice(index, 1);
        };
    }, []);

    return {
        ...state,
        toast,
        dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId }),
    };
}

export { useToast, toast };
