import { put, takeEvery, all } from "redux-saga/effects";
import * as actionTypes from "store/session/action-types";
import * as actions from "store/session/actions";

import SessionController from "api/controllers/session";
import { UNAUTHORIZED } from "utils/http-status";
import { setAuthenticationToken } from "api/axios";

function* signIn(action) {
    const { email, authenticationString } = action.payload;

    try {
        yield put(actions.setSessionLoading());
        const response = yield SessionController.signIn(
            email,
            authenticationString
        );

        const user = response.data;
        setAuthenticationToken(user.token);

        yield put(actions.setSessionSuccess(user));
    } catch (error) {
        switch (error.response.status) {
            case UNAUTHORIZED: {
                error.message = "error:incorrectEmailOrPassword";
            }
        }

        yield put(actions.setSessionError(error));
    }
}

function* watchSignIn() {
    yield takeEvery(actionTypes.SIGN_IN_REQUEST, signIn);
}

export default function* rootSaga() {
    yield all([watchSignIn()]);
}
