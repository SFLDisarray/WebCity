import React from 'react';
import Input from "../../input";
import Button from '../../button';
import isFormValid from './is-valid-form';
import md5 from 'md5';

import { withAuthForm, withHandlerInput } from "../../HOC";
import { Link } from "react-router-dom";
import { auth, database } from "../../../config/firebase";
import compose from "../../../utils/compose";

import { routerPath } from "../../../config/router-path";
import { firebaseRef } from '../../../config/ref';

import './register.scss';
import '../form-redirect.scss';
import { TAuthError } from '../../../types';

export type TUserRegister = {
  username: string
  email: string
  password: string
  passwordRepeat: string
}

type TRegisterForm = {
  hasError: string
  setHasError: (error: string) => void
  loading: boolean
  setLoading: (state: boolean) => void
  input: TUserRegister
  setInput: (state: TUserRegister) => any
  onInput: (state: string) => void
}

const Register: React.FC<TRegisterForm> = ({ loading, setLoading, hasError, setHasError, input, setInput, onInput }: TRegisterForm) => {

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (isFormValid(input, setHasError)) {
      setLoading(true);
      setHasError('');

      createUserWithEmailAndPassword()
        .then(() => console.log('Пользователь сохранён!'))
        .then(onSucsess)
        .catch(onRejection)
    }
  }

  async function createUserWithEmailAndPassword() {
    const createdUser = await auth.createUserWithEmailAndPassword(input.email, input.password);

    if (createdUser && createdUser.user) {
      createdUser.user.updateProfile({
        displayName: input.username,
        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email as string)}?d=identicon`
      }).then(() => onCreatedUserInDatabase(createdUser))
    }
  }


  function onCreatedUserInDatabase(createdUser: any) {
    return database.ref(firebaseRef.USERS)
      .child(createdUser.user.uid)
      .set(onCreatedUser(createdUser));
  }

  function onCreatedUser(createdUser: any) {
    return {
      id: createdUser.user.uid,
      username: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
      isOnline: false
    }
  }

  function onSucsess() {
    setLoading(false);
    setInput({
      username: '',
      email: '',
      password: '',
      passwordRepeat: '',
    });
  }

  function onRejection(error: TAuthError) {
    setHasError(error.message);
    setLoading(false);
  }

  return (
    <form className="login" onSubmit={onSubmit}>
      <Input label="Имя пользователя" name="username" onChange={onInput} value={input.username} />
      <Input label="Email" name="email" onChange={onInput} type="email" value={input.email} />
      <Input label="Пароль" name="password" type="password" onChange={onInput} value={input.password} />
      <Input label="Повторите пароль" name="passwordRepeat" type="password" onChange={onInput} value={input.passwordRepeat} />

      <Button className="button-auth-form" loading={loading}>Регистрация</Button>

      <Link to={routerPath.loginPage} className="form-redirect">Уже зарегистрированы?</Link>

      {hasError && hasError.length > 0 ? <span className="form-error">{hasError}</span> : ''}
    </form>
  )
};

export default compose(
  withAuthForm('Регистрация'),
  withHandlerInput({
    username: '',
    email: '',
    password: '',
    passwordRepeat: '',
  })
)(Register)

