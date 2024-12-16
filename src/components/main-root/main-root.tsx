/**
 * В компоненте содержится логика проверки
 * на какую сттаницу пересылать пользователя.
 * Если он не авторизован, перевести на страницу логина
 * Если авторизован, то получить данные пользоваетля из базы данных,
 * сохранить данные и перебросить пользователя на главную страницу
 */

import React, { useCallback, useEffect } from 'react'

import { auth, database } from "../../config/firebase";
import TemplateMainPage from './template-main-page';

import compose from "../../utils/compose";
import { withRouter } from 'react-router-dom';

import { connect } from "react-redux";
import { getLogInUser, logOutUser, setActiveChannel } from '../../actions';
import { TChannel, TDatabaseSnapshot, THistory } from "../../types";
import { routerPath } from "../../config/router-path";

import { TAuthIsLoaded } from '../../types/redux-state';

import { firebaseRef } from '../../config/ref';
import { TUser } from '../../types/redux';

import '../../assets/styles/bootstrap-reboot.min.scss';
import '../../assets/styles/fonts.scss';
import '../../assets/styles/transition.scss';

type TMainRoot = {
  getLogInUser: (user: TUser) => void
  history: THistory
  logOutUser: () => void
  isLoaded: boolean
  setActiveChannel: (channel: TChannel | null) => any;
}

const MainRoot: React.FC<TMainRoot> = ({ getLogInUser, history, logOutUser, isLoaded, setActiveChannel }: TMainRoot) => {

  function onAuthStateChanged() {
    auth.onAuthStateChanged((logInUser) => {
      if (!logInUser) return isLogOff();

      return getUserFromDatabaseByUid(logInUser && logInUser.uid);
    });
  }

  const changePath = useCallback((path: string) => {
    if (history.location.pathname !== path) {
      history.push(path);
    }
  }, [history])

  const isLoggedIn = useCallback((user: TUser) => {
    getLogInUser(user);
    changePath(routerPath.main);
  }, [changePath, getLogInUser])

  const isLogOff = useCallback(() => {
    logOutUser();
    setActiveChannel(null);
    changePath(routerPath.loginPage);
  }, [changePath, logOutUser, setActiveChannel])


  const getUserFromDatabaseByUid = useCallback((uid: string) => {
    database.ref(firebaseRef.USERS)
      .child(uid)
      .on('value', (snap: TDatabaseSnapshot) => {
        const user: TUser = snap.val();
        isLoggedIn(user);
      })
  }, [isLoggedIn])

  useEffect(onAuthStateChanged, [getUserFromDatabaseByUid, isLogOff]);

  return <TemplateMainPage isLoaded={isLoaded} />
};

const mapStateToProps = ({ auth: { isLoaded } }: TAuthIsLoaded) => {
  return { isLoaded };
}

export default compose(
  withRouter,
  connect(mapStateToProps, { getLogInUser, logOutUser, setActiveChannel }),
)(MainRoot)
