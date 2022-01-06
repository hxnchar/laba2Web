import React, { useState } from 'react';
import { Input } from './Input';
import Loader from 'react-loader-spinner';

export const Form = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [countSpinners, setCountSpinners] = useState(0);
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
    setCountSpinners.update(n=>(n+1));
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
      const responce = await res.json();
      setCountSpinners.update(n=>(n-1));
      setDisableButton(false);
      if (responce.errors) {
        throw new Error(responce.errors[0]);
      } else {
        setResultText('Email is sent');
      }
    } catch (er) {
      setResultText(er.message);
      setCountSpinners.update(n=>(n-1));
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
      {countSpinners > 0 ? <Loader /> : null}
      <br />
      {resultText}
    </form>
  );
};
