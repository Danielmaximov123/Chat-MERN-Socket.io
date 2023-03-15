import axios from "axios";
import { toast } from "react-toastify";

export const logIn = (data, checkOnlineUser , newUser) => async (dispatch) => {
  dispatch({ type: "AUTH_LOADING", payload: true });
  let resp = await axios.post(
    `${process.env.REACT_APP_URL_API}/auth/login`,
    data
  );
  if (checkOnlineUser?.isLogin) {
    toast.error("The user is already logged in...", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    dispatch({ type: "AUTH_LOADING", payload: false });
    return;
  }
  const { success, token, message } = resp.data;
  if (success) {
    if(!newUser) {
      localStorage.setItem("token", token);
      toast.success("Login successfully!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
    dispatch({ type: "GET_LOGIN", payload: token });
    dispatch({ type: "AUTH_LOADING", payload: false });
  } else {
    toast.error(message, { position: toast.POSITION.BOTTOM_CENTER });
    dispatch({ type: "AUTH_LOADING", payload: false });
  }
};

export const LoadUser = () => {
  return (dispatch, getState) => {
    dispatch({ type: "AUTH_LOADING", payload: true });
    const token = getState()?.auth?.token;
    dispatch({ type: "AUTH_LOADING", payload: false });
    if (token) {
      dispatch({ type: "LOAD_USER", payload: token });
    } else {
      if (token) {
        dispatch({ type: "LOAD_USER", payload: token });
      } else return null;
    }
  };
};

export const signUp = (data, user) => async (dispatch) => {
  dispatch({ type: "AUTH_LOADING", payload: true });
  let resp = await axios.post(
    `${process.env.REACT_APP_URL_API}/auth/register`,
    data,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
  const { success, getUser, message } = resp.data;
  if (success) {
    toast.success("Welcome to the chat!", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    dispatch({ type: "ADD_USER", payload: getUser });
    
    // After registration, log in the user
    const loginData = {
      email: user.email,
      password: user.password,
    };
    dispatch(logIn(loginData, null , 'newUser'));
    dispatch({ type: "AUTH_LOADING", payload: false });
  } else {
    toast.error(message, { position: toast.POSITION.BOTTOM_CENTER });
    dispatch({ type: "AUTH_LOADING", payload: false });
  }
};

export const getChangePasswordUser = async (id, data) => {
  let resp = await axios.put(
    `${process.env.REACT_APP_URL_API}/auth/change-password/${id}`,
    data
  );
  return resp.data;
};
