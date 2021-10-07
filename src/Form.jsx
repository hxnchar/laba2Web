import React, { useState } from 'react';
import { Input } from './Input';
import Loader from 'react-loader-spinner';
import { useLocation } from 'react-router-dom';

export const Form = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [showSpinner, setShowSpinner] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [resultText, setResultText] = useState('');
  const formData = {
    email,
    name,
    password,
    passwordConfirm,
  };
  const route = useLocation();
  const fullRoute = window.location.href;
  const rootURL = fullRoute.substr(0, fullRoute.indexOf(route));
  const onSubmit = async e => {
    e.preventDefault();
    //https://2laba-dev-react.vercel.app/api/sendMail
    setShowSpinner(true);
    setResultText('');
    setDisableButton(true);
    const result = await fetch(rootURL + 'api/sendMail', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responce = await result.json();
    setShowSpinner(false);
    setDisableButton(false);
    if (!responce.result.success) {
      setResultText(responce.message);
    } else {
      setResultText('Email is sent');
    }
  };
  return (
    <form onSubmit={e => onSubmit(e)}>
      <Input
        placeholder="Enter email"
        type="email"
        label="Email"
        value={email}
        setValue={setEmail}
      />
      <Input
        placeholder="Enter name"
        type="text"
        label="Name"
        value={name}
        setValue={setName}
      />
      <Input
        placeholder="Enter password"
        type="password"
        label="Password"
        value={password}
        setValue={setPassword}
      />
      <Input
        placeholder="Confirm password"
        type="password"
        label="Confirm password"
        value={passwordConfirm}
        setValue={setPasswordConfirm}
      />
      <Input type="submit" disabled={disableButton} />
      {showSpinner ? <Loader /> : null}
      <br />
      {resultText}
    </form>
  );
};
