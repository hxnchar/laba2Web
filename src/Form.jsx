import React, { useState } from 'react';
import { Input } from './Input';
import Loader from 'react-loader-spinner';

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
  const onSubmit = async e => {
    e.preventDefault();
    setShowSpinner(true);
    setResultText('');
    setDisableButton(true);
    try {
      const res = await fetch('/api/sendMail', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.result.success) {
        throw new Error(res.result.errors[0]);
      }
      const responce = await res.json();
      setShowSpinner(false);
      setDisableButton(false);
      if (!responce.res.success) {
        setResultText(responce.message);
      } else {
        setResultText('Email is sent');
      }
    } catch (er) {
      setResultText(er.message);
      setShowSpinner(false);
      setDisableButton(false);
    }
  };
  return (
    <form onSubmit={onSubmit}>
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
